
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
    const singnUp = await pool.query(`INSERT INTO USERS (email, hashed_password) VALUES ($1, $2)`,
      [email, hashedPassword])

      const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})

      res.json({email, token})

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

    if (!users.rows.length) return res.json({detail: 'User does not exist!'})

    const succes = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})

    if (succes) {
      res.json({'email': users.rows[0].email, token})
    } else {
      res.json({detail: 'Login failed!'})
    }

  } catch (err) {
    console.error(err)
  }
})



app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});


//get all veranstaltungen
app.get("/veranstaltungen/:userEmail", async (req, res) => {
  const { userEmail } = req.params
  console.log(userEmail)

  try {
    const allTodos = await pool.query("SELECT * FROM veranstaltung WHERE v_id IN (SELECT veranstaltung FROM veranstaltung_users WHERE teilnehmer = $1)",
    [userEmail]);
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
    const teilnehmer = await pool.query("SELECT email FROM users WHERE email IN (SELECT teilnehmer FROM veranstaltung_users WHERE veranstaltung = $1)",
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

