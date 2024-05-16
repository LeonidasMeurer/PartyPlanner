
const express = require("express");
const app = express();
const cors = require('cors');
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//middleware
app.use(cors());
app.use(express.json()); //req.body

// Test Connection
/* (async () => {

  try {
    const response = await pool.query("SELECT current_user");
    const { rows } = response;
    const currentUser = rows[0]['current_user'];
    console.log(currentUser);  // postgres
  } catch (err) {
    console.log(err);
  }

})(); */


// USERS
//singup
app.post('/signup', async (req, res) => {
  const { u_email, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  try {
    const users = await pool.query(`INSERT INTO users (u_email, hashed_password) VALUES ($1, $2) RETURNING *`,
      [u_email, hashedPassword])

    const token = jwt.sign({ u_email }, 'secret', { expiresIn: '1hr' })

    res.json({ 'u_email': users.rows[0].u_email, token, 'userId': users.rows[0].u_id })

  } catch (err) {
    console.error(err)
    if (err) {
      res.json({ detail: err.detail })
    }
  }
})

//login
app.post('/login', async (req, res) => {
  const { u_email, password } = req.body

  try {
    const users = await pool.query('SELECT * FROM users WHERE u_email = $1', [u_email])
    console.log(users.rows[0].u_id)

    if (!users.rows.length) return res.json({ detail: 'User does not exist!' })

    const succes = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({ u_email }, 'secret', { expiresIn: '1hr' })

    if (succes) {
      res.json({ 'u_email': users.rows[0].u_email, token, 'userId': users.rows[0].u_id })
    } else {
      res.json({ detail: 'Login failed!' })
    }

  } catch (err) {
    console.error(err)
  }
})


//get user
app.get("/user/:u_id", async (req, res) => {
  const { u_id } = req.params
  console.log(u_id)

  try {
    const user = await pool.query("SELECT * FROM users WHERE u_id = $1",
      [u_id]);
    res.json(user.rows);
    console.log(user.rows)
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/user/:u_id", async (req, res) => {
  const { u_id } = req.params
  const { u_email, u_ernaehrungsform } = req.body
  try {
    const editGuest = await pool.query(
      "UPDATE users SET u_email = $1, u_ernaehrungsform = $2 WHERE u_id = $3 RETURNING *",
      [u_email, u_ernaehrungsform, u_id]
    );
    res.json(editGuest);
  } catch (err) {
    console.error(err.message);
  }
});

// Veranstaltungen
// create Veranstaltung
app.post("/veranstaltung", async (req, res) => {
  try {
    const { v_name, teilnehmer_anzahl, datum, beschreibung, u_email, ort, u_id } = req.body;
    console.log(v_name, teilnehmer_anzahl, datum, beschreibung, u_email, ort, u_id)
    const newVeranstaltung = await pool.query(
      "INSERT INTO veranstaltung (v_name, teilnehmer_anzahl, datum, beschreibung, u_email, ort, u_id)VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [v_name, teilnehmer_anzahl, datum, beschreibung, u_email, ort, u_id]
    );
    const veranstaltung_user = await pool.query(
      "INSERT INTO veranstaltung_users (v_id, u_id) VALUES ($1, $2)",
      [newVeranstaltung.rows[0].v_id, u_id]
    )

    res.json(newVeranstaltung.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});


// edit Veranstaltung
app.put("/veranstaltung/:v_id", async (req, res) => {
  try {
    const { v_id } = req.params
    const { v_name, teilnehmer_anzahl, datum, beschreibung, u_email, ort, u_id } = req.body;
    console.log(v_name, teilnehmer_anzahl, datum, beschreibung, u_email, ort, u_id)
    const editVeranstaltung = await pool.query(
      "UPDATE veranstaltung SET v_name = $1, teilnehmer_anzahl = $2, datum = $3, beschreibung = $4, ort = $5 WHERE v_id = $6",
      [v_name, teilnehmer_anzahl, datum, beschreibung, ort, v_id]
    );
    res.json(editVeranstaltung);
  } catch (err) {
    console.error(err.message);
  }
});

// delete Veranstaltung
app.delete("/veranstaltung/:v_id", async (req, res) => {
  try {
    const { v_id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM veranstaltung WHERE v_id = $1", [
      v_id
    ]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});


//get all veranstaltungenu_id
app.get("/veranstaltungen/:userId", async (req, res) => {
  const { userId } = req.params
  console.log(userId)

  try {
    const allTodos = await pool.query("SELECT * FROM veranstaltung WHERE v_id IN (SELECT v_id FROM veranstaltung_users WHERE u_id = $1)",
      [userId]);
    res.json(allTodos.rows);
    console.log(allTodos.rows)
  } catch (err) {
    console.error(err.message);
  }
});


//get a veranstaltung
app.get("/veranstaltung/:v_id", async (req, res) => {
  try {
    const { v_id } = req.params;
    console.log("ID:", v_id)
    const veranstaltung = await pool.query("SELECT * FROM veranstaltung WHERE v_id = $1", [
      v_id
    ]);

    res.json(veranstaltung.rows);
    console.log(veranstaltung.rows)
  } catch (err) {
    console.error(err.message);
  }
});

//get users einer veranstaltungen
app.get("/veranstaltung_teilnehmer/:v_id", async (req, res) => {
  const { v_id } = req.params
  console.log(v_id)

  try {
    const teilnehmer = await pool.query("SELECT u_email FROM users WHERE u_id IN (SELECT u_id FROM veranstaltung_users WHERE v_id = $1)",
      [v_id]);
    res.json(teilnehmer.rows);
    console.log(teilnehmer.rows)
  } catch (err) {
    console.error(err.message);
  }
});

// add Guest
app.post("/guest", async (req, res) => {
  try {
    const { g_name, zusage, g_ernaehrungsform, anmerkung, v_id } = req.body;
    console.log(v_id)
    const newVeranstaltung = await pool.query(
      "INSERT INTO gaeste (g_name, zusage, g_ernaehrungsform, anmerkung, v_id)VALUES($1, $2, $3, $4, $5) RETURNING *",
      [g_name, zusage, g_ernaehrungsform, anmerkung, v_id]
    );

    res.json(newVeranstaltung.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/gast/:g_id", async (req, res) => {
  try {
    const { g_id, zusage } = req.body
    const editGuest = await pool.query(
      "UPDATE gaeste SET zusage = $1 WHERE g_id = $2 RETURNING *",
      [zusage, g_id]
    );
    res.json(editGuest);
  } catch (err) {
    console.error(err.message);
  }
});


//get Gueste einer veranstaltungen
app.get("/veranstaltung_gaeste/:v_id", async (req, res) => {
  const { v_id } = req.params
  console.log(v_id)

  try {
    const teilnehmer = await pool.query("SELECT * FROM gaeste WHERE v_id = $1 ORDER BY g_id",
      [v_id]);
    res.json(teilnehmer.rows);
    console.log(teilnehmer.rows)
  } catch (err) {
    console.error(err.message);
  }
});


//update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );

    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id
    ]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});

