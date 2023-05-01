// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient  // old way to connect to MongoDB
var mongoose = require('mongoose'); //new way of connecting and this uses schema's which give us a blueprint so that we have control that stays consistent
var passport = require('passport'); // authentications 
var flash    = require('connect-flash'); // error messages when adding a the wrong email 

var morgan       = require('morgan'); // morgan is our logger and shows us what is happening in our application, morgan logs all teh requsts -- install package 
var cookieParser = require('cookie-parser'); // helps us stay logged in
var bodyParser   = require('body-parser'); 
var session      = require('express-session');

var configDB = require('./config/database.js'); //how we are pulling our database, it is holding the object that has an URL property and a DB property.

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2023a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
