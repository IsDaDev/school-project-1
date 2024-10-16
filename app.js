// **********************************************************************************************************
// INFROMATIONS ABOUT THE PROJECT
// school-project-1 aka projectmosc is a schoolproject that showcases cars with unique media designs crearted
// by us paul mond (isdadev) & phillip schlichting (philrico)
// **********************************************************************************************************

// **********************************************************************************************************
// IMPORT SECTION
// **********************************************************************************************************

require('dotenv').config();

// Import necessary modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const emailjs = require('@emailjs/nodejs');

// **********************************************************************************************************
// VARIABLE SECTION
// **********************************************************************************************************

let carData = []; // Initialize carData as an empty array
let totalDatabaseRows;
let captchaCode;

// **********************************************************************************************************
// SERVER SECTION
// **********************************************************************************************************

// Create an instance of Express
const app = express();

// Middleware to serve static files and set the view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// **********************************************************************************************************
// CONFIGURATION FOR EMAILJS
// **********************************************************************************************************

emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
  blockHeadless: true,
  limitRate: {
    id: 'app',
    throttle: 10000,
  },
});

// **********************************************************************************************************
// DATABASE QUERY ALL SECTION
// **********************************************************************************************************

// Connect to the SQLite database
const db = new sqlite3.Database(
  path.join(__dirname, 'carDBLong.db'),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error('Could not connect to the database', err);
    } else {
      console.log('Connected to the SQLite database.');
    }
  }
);

// Load car data from the database on server start
db.all('SELECT * FROM carDBLong', (error, rows) => {
  if (error) {
    console.error('Error fetching data from the database:', error);
  } else {
    carData = rows; // Store the data in carData
    console.log('Car data loaded successfully.');
  }
});

db.get('SELECT COUNT(*) AS count FROM carDBLong', (err, row) => {
  if (err) {
    console.error(err.message);
    return;
  } else {
    totalDatabaseRows = row.count;
  }
});

// **********************************************************************************************************
// ROUTES SECTION
// **********************************************************************************************************

// Define routes
app.get('/', (req, res) => {
  if (carData.length > 0) {
    const randomCar = carData[Math.floor(Math.random() * carData.length)];

    res.render('homepage', { randomCar });
  } else {
    res.render('homepage', { randomCar: null });
  }
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact/contactform', (req, res) => {
  const params = {
    name: req.body['name'],
    email: req.body['email'],
    subject: req.body['subject'],
    message: req.body['message'],
    captcha: req.body['captcha'],
  };

  if (params.captcha == captchaCode) {
    emailjs
      .send(process.env.EMAILJS_SERVICE, process.env.EMAILJS_TEMPLATE, params)
      .then((response) => {
        res.json({ responseCode: 2, message: 'Contact form submitted' });
      })
      .catch((error) => {
        console.log('FAILED...', error);
        res.json({ responseCode: 3, message: 'Error submitting form' });
      });
  } else {
    console.log(params.captcha + ' == ' + captchaCode);
    res.json({ responseCode: 1, message: 'Wrong Captcha, try again' });
  }
});

app.post('/contact/refreshCaptcha', (req, res) => {
  const num1 = Math.round(Math.random() * 20);
  const num2 = Math.round(Math.random() * 20);
  const result = num1 + num2;
  res.json({ code1: num1, code2: num2, result: result });
});

app.post('/contact/updateCaptchaCode', (req, res) => {
  captchaCode = req.body.result;
  res.status(200).send('updated');
});

app.get('/impressum', (req, res) => {
  res.render('impressum');
});

app.get('/privacy', (req, res) => {
  res.render('privacy');
});

// Gallery route
app.get('/gallery', (req, res) => {
  res.render('gallery', { carData }); // Pass carData to the template
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

// **********************************************************************************************************
// ERROR HANDLING SECTION
// **********************************************************************************************************

// Handle errors
app.use((req, res) => {
  res.status(404).render('404'); // Render 404 for unknown routes
});
