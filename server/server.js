
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
(async () => {
    
    try {
        const response = await pool.query("SELECT current_user");    
        const {rows} = response;
        const currentUser = rows[0]['current_user'];
        console.log(currentUser);  // postgres
    } catch (err) {
        console.log(err);
    }
    
})();


// USERS
//singup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  try {
    const users = await pool.query(`INSERT INTO USERS (email, hashed_password) VALUES ($1, $2) RETURNING *`,
      [email, hashedPassword])

      const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})

      res.json({'email': users.rows[0].email, token, 'userId': users.rows[0].user_id})

  } catch (err) {
    console.error(err)
    if (err) {
      res.json({detail: err.detail})
    }
  }
})

//login
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    console.log(users.rows[0].user_id)

    if (!users.rows.length) return res.json({detail: 'User does not exist!'})

    const succes = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({email} , 'secret', { expiresIn: '1hr'})

    if (succes) {
      res.json({'email': users.rows[0].email, token, 'userId': users.rows[0].user_id})
    } else {
      res.json({detail: 'Login failed!'})
    }

  } catch (err) {
    console.error(err)
  }
})


// Veranstaltungen
// create Veranstaltung
app.post("/veranstaltung", async (req, res) => {
  try {
    const { v_name, teilnehmer_anzahl, datum, beschreibung, user_name, ort, user_id } = req.body;
    console.log(v_name, teilnehmer_anzahl, datum, beschreibung, user_name, ort, user_id)
    const newVeranstaltung = await pool.query(
      "INSERT INTO veranstaltung (v_name, teilnehmer_anzahl, datum, beschreibung, user_name, ort, user_id)VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [v_name, teilnehmer_anzahl, datum, beschreibung, user_name, ort, user_id]
    );
    const veranstaltung_user = await pool.query(
      "INSERT INTO veranstaltung_users (v_id, user_id, isadmin) VALUES ($1, $2, true)",
      [newVeranstaltung.rows[0].v_id, user_id]
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
    const { v_name, teilnehmer_anzahl, datum, beschreibung, user_name, ort, user_id } = req.body;
    console.log(v_name, teilnehmer_anzahl, datum, beschreibung, user_name, ort, user_id)
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


//get all veranstaltungenuser_id
app.get("/veranstaltungen/:userId", async (req, res) => {
  const { userId } = req.params
  console.log(userId)

  try {
    const allTodos = await pool.query("SELECT * FROM veranstaltung WHERE v_id IN (SELECT v_id FROM veranstaltung_users WHERE user_id = $1)",
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

//get teilnehmer einer veranstaltungen
app.get("/veranstaltung_teilnehmer/:v_id", async (req, res) => {
  const { v_id } = req.params
  console.log(v_id)

  try {
    const teilnehmer = await pool.query("SELECT email FROM users WHERE user_id IN (SELECT user_id FROM veranstaltung_users WHERE v_id = $1)",
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

