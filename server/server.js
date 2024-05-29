
const express = require("express");
const app = express();
const cors = require('cors');
const pool = require('./db')
const bcrypt = require('bcryptjs')
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
  const { u_email, password, u_ernaehrungsform } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  try {
    const users = await pool.query(`INSERT INTO users (u_email, hashed_password, u_ernaehrungsform) VALUES ($1, $2, $3) RETURNING *`,
      [u_email, hashedPassword, u_ernaehrungsform])

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
      "INSERT INTO veranstaltung_users (v_id, u_id, zusage) VALUES ($1, $2, $3)",
      [newVeranstaltung.rows[0].v_id, u_id, 'Zugesagt']
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
app.get("/veranstaltung_helfer/:v_id", async (req, res) => {
  const { v_id } = req.params
  console.log(v_id)

  try {
    const teilnehmer = await pool.query("SELECT * FROM users JOIN veranstaltung_users ON users.u_id = veranstaltung_users.u_id WHERE veranstaltung_users.v_id = $1 ORDER BY users.u_id",
      [v_id]);
    res.json(teilnehmer.rows);
    console.log(teilnehmer.rows)
  } catch (err) {
    console.error(err.message);
  }
});

// add Helfer
app.post("/veranstaltung_helfer/:v_id", async (req, res) => {
  try {
    const { u_email, zusage } = req.body;
    const { v_id } = req.params
    const user = await pool.query("SELECT u_id FROM users WHERE u_email = $1", [
      u_email
    ]);
    console.log(user.rows[0].u_id)
    const newVeranstaltung = await pool.query(
      "INSERT INTO veranstaltung_users(u_id, v_id, zusage) VALUES($1, $2, $3) RETURNING *",
      [user.rows[0].u_id, v_id, zusage]
    );

    res.json(newVeranstaltung.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Edit Helfer
app.put("/helfer/:v_id", async (req, res) => {
  try {
    const { zusage, u_id } = req.body
    const { v_id } = req.params
    const editGuest = await pool.query(
      "UPDATE veranstaltung_users SET zusage = $1 WHERE u_id = $2 AND v_id = $3 RETURNING *",
      [zusage, u_id, v_id]
    );
    res.json(editGuest);
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
    const { zusage } = req.body
    const { g_id } = req.params
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


//get a rezepte
app.get("/rezepte_user/:u_id", async (req, res) => {
  try {
    const { u_id } = req.params;
    console.log(u_id)
    const rezepte = await pool.query("SELECT * FROM rezepte WHERE u_id = $1 ORDER BY r_id", [
      u_id
    ]);
    console.log(rezepte.rows)
    res.json(rezepte.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a rezepte
app.get("/rezepte_veranstaltung/:v_id", async (req, res) => {
  try {
    const { v_id } = req.params;
    console.log(v_id)
    const rezepte = await pool.query(`
      SELECT * FROM rezepte 
        JOIN rezept_veranstaltung
        ON rezepte.r_id = rezept_veranstaltung.r_id
        JOIN users
        ON rezepte.u_id = users.u_id
      WHERE v_id = $1 AND rezepte.r_id IN 
      (SELECT r_id FROM rezept_veranstaltung WHERE v_id = $1)
      ORDER BY rezepte.r_id`, [
      v_id
    ]);
    console.log(rezepte.rows)
    res.json(rezepte.rows);
  } catch (err) {
    console.error(err.message);
  }
});


// delete Veranstaltung
app.delete("/rezepte_veranstaltung/:r_id", async (req, res) => {
  try {
    const { r_id } = req.params;
    const { v_id} = req.body;
    const deleteRezept = await pool.query("DELETE FROM rezept_veranstaltung WHERE r_id = $1 AND v_id = $2", [
      r_id, v_id
    ]);
    res.json("Rezept was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});


app.put("/rezepte_veranstaltung/:r_id", async (req, res) => {
  const { r_id } = req.params
  const { new_r_id, portionen, v_id } = req.body
  try {
    const editRezept = await pool.query(
      "UPDATE rezept_veranstaltung SET portionen = $1, r_id = $2 WHERE r_id = $3 AND v_id = $4 RETURNING *",
      [portionen, new_r_id, r_id, v_id]
    );
    res.json(editRezept);
  } catch (err) {
    console.error(err.message);
  }
});


// add Rezept
app.post("/rezepte", async (req, res) => {
  try {
    const { r_name, r_ernaehrungsform, salzig, u_id } = req.body;

    const newVeranstaltung = await pool.query(
      "INSERT INTO rezepte ( r_name, r_ernaehrungsform, salzig, u_id )VALUES($1, $2, $3, $4) RETURNING *",
      [ r_name, r_ernaehrungsform, salzig, u_id ]
    );

    res.json(newVeranstaltung.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/rezepte/:r_id", async (req, res) => {
  const { r_id } = req.params
  const { r_name, r_ernaehrungsform, salzig } = req.body
  try {
    const editRezept = await pool.query(
      "UPDATE rezepte SET r_name = $1, r_ernaehrungsform = $2, salzig = $3 WHERE r_id = $4 RETURNING *",
      [r_name, r_ernaehrungsform, salzig, r_id]
    );
    res.json(editRezept);
  } catch (err) {
    console.error(err.message);
  }
});

// delete Veranstaltung
app.delete("/rezepte/:r_id", async (req, res) => {
  try {
    const { r_id } = req.params;
    const deleteRezept = await pool.query("DELETE FROM rezepte WHERE r_id = $1", [
      r_id
    ]);
    res.json("Rezept was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});


// add Rezept to Veranstaltung
app.post("/rezept_to_veranstaltung/:v_id", async (req, res) => {
  try {
    const { v_id } = req.params;
    const { r_id, portionen } = req.body;
    console.log(v_id, r_id, portionen)

    const rezepteVeranstaltung = await pool.query(
      "INSERT INTO rezept_veranstaltung ( v_id, r_id, portionen )VALUES($1, $2, $3) RETURNING *",
      [ v_id, r_id, portionen ]
    );

    res.json(rezepteVeranstaltung.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});



//get aufgaben
app.get("/aufgaben/:v_id", async (req, res) => {
  try {
    const { v_id } = req.params;
    const aufgaben = await pool.query("SELECT * FROM aufgabe JOIN users ON users.u_id = aufgabe.u_id WHERE v_id = $1 ORDER BY a_id", [
      v_id
    ]);
    console.log(aufgaben.rows)
    res.json(aufgaben.rows);
  } catch (err) {
    console.error(err.message);
  }
});


// add Aufgabe
app.post("/aufgabe", async (req, res) => {
  try {
    const { a_name, a_beschreibung, v_id, u_id } = req.body;
    console.log( a_name, a_beschreibung, v_id, u_id )
    const aufgabe = await pool.query(
      "INSERT INTO aufgabe (a_name, a_beschreibung, v_id, u_id)VALUES($1, $2, $3, $4) RETURNING *",
      [a_name, a_beschreibung, v_id, u_id]
    );

    res.json(aufgabe.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update Aufgabe
app.put("/aufgabe/:a_id", async (req, res) => {
  const { a_id } = req.params
  const { a_name, a_beschreibung, u_id } = req.body
  try {
    const editAufgabe = await pool.query(
      "UPDATE aufgabe SET a_name = $1, a_beschreibung = $2, u_id = $3 WHERE a_id = $4 RETURNING *",
      [a_name, a_beschreibung, u_id, a_id]
    );
    res.json(editAufgabe);
  } catch (err) {
    console.error(err.message);
  }
});

// delete Veranstaltung
app.delete("/aufgabe/:a_id", async (req, res) => {
  try {
    const { a_id } = req.params;
    const deleteRezept = await pool.query("DELETE FROM aufgabe WHERE a_id = $1", [
      a_id
    ]);
    res.json("Aufgabe was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});


app.listen(process.env.NODE_DOCKER_PORT, () => {
  console.log(`server has started on port ${process.env.NODE_DOCKER_PORT}`);
});

