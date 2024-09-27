// requires all the important and important variables
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
let carData;

// selects the database via sqlite3
const db = new sqlite3.Database('carDBLong.db');

// makes an app object with the express npm bundle
const app = express();

// selects everything from the database
db.all('SELECT * FROM carDBLong', (error, rows) => {
  // error handling
  if (error) {
    console.error(error);
  } else {
    // puts the data in the global variable data
    carData = rows;
  }
});

// changes the static path to be the dirname + public
app.use(express.static(path.join(__dirname, 'public')));
// sets the view engine to ejs so that it is able to render the ejs templates
app.set('view engine', 'ejs');

// starts the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// ****************************************************
// not finished
// ****************************************************

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact/contactform', (req, res) => {
  // gets the data from the form and sends it with emailJS
});

// a simple get route for the gallery
app.get('/gallery', (req, res) => {
  // renders the ejs template for the gallery
  // passing all the db-data to the ejs template
  res.render('index', { carData: carData });
});

// sets up a dynamic route that links to every car
// if the car is located inside the database, it will render the template
// for the car with all the information about the car
// if the car is not located inside the database,
// it will return a 404 template
app.get('/gallery/:carName', (req, res) => {
  // gets the car name from the route parameters
  const carName = req.params.carName;

  // looks if the car is inside the database
  // if the car is inside the database it renders the template and passes
  // the data of the car to the website else it renders 404.ejs
  db.get('SELECT * FROM carDBLong WHERE uid = ?', [carName], (err, row) => {
    if (!row || err) {
      res.render('404');
    } else {
      // res.render('carpage', { carData: row });
      res.send(row);
    }
  });
});
