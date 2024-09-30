// Import necessary modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let carData = []; // Initialize carData as an empty array

// Create an instance of Express
const app = express();

// Connect to the SQLite database
const db = new sqlite3.Database('carDBLong.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Middleware to serve static files and set the view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Load car data from the database on server start
db.all('SELECT * FROM carDBLong', (error, rows) => {
  if (error) {
    console.error('Error fetching data from the database:', error);
  } else {
    carData = rows; // Store the data in carData
    console.log('Car data loaded successfully.');
  }
});

// Define routes
app.get('/', (req, res) => {
  res.render('home'); // Ensure home.ejs exists
});

app.get('/contact', (req, res) => {
  res.render('contact'); // Ensure contact.ejs exists
});

app.post('/contact/contactform', (req, res) => {
  // Handle form submission logic here
  res.send('Contact form submitted'); // Placeholder response
});

// Gallery route
app.get('/gallery', (req, res) => {
  res.render('index', { carData: carData }); // Pass carData to the template
});

// Dynamic car route
app.get('/gallery/:carName', (req, res) => {
  const carName = req.params.carName;

  db.get('SELECT * FROM carDBLong WHERE uid = ?', [carName], (err, row) => {
    if (err || !row) {
      res.render('404'); // Render 404 if car not found or error occurs
    } else {
      res.render('carpage', { carData: row }); // Pass car data to carpage template
    }
  });
});

// Handle errors
app.use((req, res, next) => {
  res.status(404).render('404'); // Render 404 for unknown routes
});
