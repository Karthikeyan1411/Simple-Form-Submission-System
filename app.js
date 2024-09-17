const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");
const session = require('express-session');

const app = express();
const port = 5000;

// Create MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Default MySQL user
  password: "", // Default MySQL password
  database: "userAuthentication",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "assets")));
app.use(bodyParser.json()); // in case you want to handle json payloads as well
app.use(session({
    secret: 'P52ZBjZ61S', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "profile.html"));
});

// Handle Form Submission for Signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const query = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
    connection.query(query, [username, hashedPassword], (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Error inserting data");
        return;
      }
      res.send("User Registered Successfully!");
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An unexpected error occured.");
  }
});

// Handle Form Submission for Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  connection.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Error querying data:", err);
      res.status(500).send("Error querying data");
      return;
    }
    if (results.length === 0) {
      res.status(401).send("Invalid username or password");
      return;
    }

    const user = results[0];
    try {
      const match = await bcrypt.compare(password, user.password_hash);

      if (match) {
        req.session.username = username;
        res.send("Login successful!");
        // for redirect to profile page
        // res.redirect('/profile');
      } else {
        res.status(401).send("Invalid username or password");
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      res.status(500).send("Error comparing passwords");
    }
  });
});

app.post("/profile", async (req, res) => {
    const { age, dob, contact } = req.body;
    const username = req.session.username; // retrieve username from session

    if(!username){
        return res.status(401).send("User not logged in.");
    }

    // Construct SQL query to insert or update profile
    const query = 
        `INSERT INTO profiles (username, age, dob, contact)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        age = VALUES(age),
        dob = VALUES(dob),
        contact = VALUES(contact)
    `;

    connection.query(query, [username, age, dob, contact], (err, results) => {
        if(err){
            console.error('Error updating profile:', err);
            return res.status(500).send("An unexpected error occured.");
        }
        res.send("Profile updated successfully!");
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
