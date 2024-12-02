// **********************************************************************************************************
// INFROMATIONS ABOUT THE PROJECT
// school-project-1 aka projectmosc is a schoolproject that showcases cars with unique media designs crearted
// by us paul mond (isdadev) & phillip schlichting (philrico)
// **********************************************************************************************************

// **********************************************************************************************************
// IMPORT SECTION
// **********************************************************************************************************

// require file to get the public and private key
require("dotenv").config({ path: "../.env" });

// import necessary modules
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bodyParser = require("body-parser");
const emailjs = require("@emailjs/nodejs");

// **********************************************************************************************************
// VARIABLE SECTION
// **********************************************************************************************************

let carData = []; // initialize carData as an empty array
let captchaCode; // keeps track of the current right captcha

// **********************************************************************************************************
// SERVER SECTION
// **********************************************************************************************************

// create an instance of Express
const app = express();

// middleware to serve static files and set the view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// middleware to parse the body of files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// start the server
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
    id: "app",
    throttle: 10000,
  },
});

// **********************************************************************************************************
// DATABASE QUERY ALL SECTION
// **********************************************************************************************************

// connect to the SQLite database
const db = new sqlite3.Database(
  // filepath
  path.join(__dirname, "carDBLong.db"),
  // method
  sqlite3.OPEN_READWRITE,
  // error handling
  (err) => {
    if (err) {
      console.error("Could not connect to the database", err);
    } else {
      console.log("Connected to the SQLite database.");
    }
  }
);

// load car data from the database on server start
db.all("SELECT * FROM carDBLong", (error, rows) => {
  if (error) {
    console.error("Error fetching data from the database:", error);
  } else {
    carData = rows; // store the data in carData
    console.log("Car data loaded successfully.");
  }
});

// **********************************************************************************************************
// ROUTES SECTION
// **********************************************************************************************************

// route to the homepage
app.get("/", (req, res) => {
  // checks if the length of carData is bigger than 0
  if (carData.length > 0) {
    // selects a random car from the loaded array containg all cars
    const randomCar = carData[Math.floor(Math.random() * carData.length)];
    // renders the homepage and passes the car
    res.render("homepage", { randomCar });
  } else {
    // if there was an error with getting carData it passes randomCar = null
    res.render("homepage", { randomCar: null });
  }
});

// route to get to the contact section
app.get("/contact", (req, res) => {
  res.render("contact");
});

// post route to get the submitted form
app.post("/contact/contactform", (req, res) => {
  // extracts all necessary information from the post request and saves it
  const params = {
    name: req.body["name"],
    email: req.body["email"],
    subject: req.body["subject"],
    message: req.body["message"],
    captcha: req.body["captcha"],
  };

  // checks if the captcha is correct
  if (params.captcha == captchaCode) {
    // if thats the case it tries to send the email with the data
    // param1: emailjs_service_id, param2: emailjs_template_id, param3: data
    emailjs
      .send(process.env.EMAILJS_SERVICE, process.env.EMAILJS_TEMPLATE, params)
      .then((response) => {
        // if there is no error it returns code 2 and the right message
        res.json({ responseCode: 2, message: "Contact form submitted" });
      })
      .catch((error) => {
        // if there is an error it console logs it and returns code 3
        console.log("FAILED...", error);
        res.json({ responseCode: 3, message: "Error submitting form" });
      });
  } else {
    // if the captcha is not correct it sends back code 1
    // the code on the next line is only there for testing if it works
    // console.log(params.captcha + ' == ' + captchaCode);
    res.json({ responseCode: 1, message: "Wrong Captcha, try again" });
  }
});

// route to get a fresh captcha
app.post("/contact/refreshCaptcha", (req, res) => {
  // generates 2 random numbers between 1 and 20 and saves them in a variable
  const num1 = Math.ceil(Math.random() * 20);
  const num2 = Math.ceil(Math.random() * 20);

  // the result is just both of the numbers combined
  const result = num1 + num2;

  // returns the 3 variables in json format
  res.json({ code1: num1, code2: num2, result: result });
});

// route to update captcha server-side
app.post("/contact/updateCaptchaCode", (req, res) => {
  // updates captchaCode to the code being sent via the post request
  captchaCode = req.body.result;
  // returns status code 200
  res.status(200).send("updated");
});

// route for the impressum
app.get("/impressum", (req, res) => {
  res.render("impressum");
});

// route for the privacy-agreement
app.get("/privacy", (req, res) => {
  res.render("privacy");
});

// route leading to the gallery
app.get("/gallery", (req, res) => {
  res.render("gallery", { carData }); // Pass carData to the template
});

// dynamic routes for each car inside the gallery
app.get("/gallery/:carName", (req, res) => {
  // gets the carname from the request parameters
  const carName = req.params.carName;

  // searches for the car in the database via SQL
  db.get("SELECT * FROM carDBLong WHERE uid = ?", [carName], (err, row) => {
    // if the car is not found or there was an error it leads to the 404 page
    if (err || !row) {
      res.render("404");
    } else {
      // if the car is found and no error it renders the carpage with the dynamic route
      // and passes the data for that selected car to the ejs template
      sanitize(row);
      res.render("carpage", { carData: sanitize(row) });
    }
  });
});

// **********************************************************************************************************
// ERROR HANDLING SECTION
// **********************************************************************************************************

// renders the 404 not found page if the page doesn't exist
app.use((req, res) => {
  res.status(404).render("404");
});

// **********************************************************************************************************
// MISC SECTION
// **********************************************************************************************************

const sanitize = (rowOfData) => {
  let c = 0;
  let dict = new Object();
  Object.entries(rowOfData).forEach(([key, value]) => {
    if (key === "uid" || key === "image_url") {
      return;
    }
    let finishedKey = key.substring(0, 1).toUpperCase() + key.substring(1);
    finishedKey = finishedKey.replaceAll("_", " ");

    switch (c) {
      case 3:
        value = value + " kg";
        break;

      case 6:
        value = value + " hp";
        break;

      case 7:
        value = value + " nm";
        break;

      case 8:
        value = value + " km/h";
        break;

      case 11:
        value = value + " l/100km";
        break;

      case 12:
        value = value + " s";
        break;

      case 13:
        value = value + " €";
        break;

      default:
        break;
    }

    dict[finishedKey] = value;
    c++;
  });
  return dict;
};
