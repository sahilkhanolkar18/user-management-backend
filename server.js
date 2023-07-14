const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

// Create the MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_pass",
  database: "the_dummy_users",
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the MySQL database:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

const app = express();
app.use(cors());
app.use(express.json());

// Define the routes

// GET /users - Get a list of all users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// POST /users - Create a new user
app.post("/users", (req, res) => {
  const { name, email, phone } = req.body;
  const query = "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)";
  connection.query(query, [name, email, phone], (error, result) => {
    if (error) throw error;
    res.status(201).json({ id: result.insertId, name, email, phone });
  });
});

// GET /users/:user_id - Get a specific user by ID
app.get("/users/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const query = "SELECT * FROM users WHERE id = ?";
  connection.query(query, [userId], (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(results[0]);
    }
  });
});

// PUT /users/:user_id - Update a specific user by ID
app.put("/users/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const { name, email, phone } = req.body;
  const query = "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?";
  connection.query(query, [name, email, phone, userId], (error, result) => {
    if (error) throw error;
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ id: userId, name, email, phone });
    }
  });
});

// DELETE /users/:user_id - Delete a specific user by ID
app.delete("/users/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const query = "DELETE FROM users WHERE id = ?";
  connection.query(query, [userId], (error, result) => {
    if (error) throw error;
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
