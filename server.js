'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const objectID = require('mongodb').objectID;

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:true,
  saveUninitialized:true,
  cookie: {secure:false}
}));
app.use(passport.session());
app.use(passport.initialize());

// Set Up Template Engine
app.set('view engine', 'pug');

app.route('/').get((req, res) => {
  res.render(process.cwd() + '/views/pug', {title:'Hello', message:'Please login'});
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + process.env.PORT);
});

passport.serializeUser((user,done) => {
  done(null, user._id);
});

passport.deserializeUser((id,done) => {
  myDB.findOne({_id: new objectID(id)}, (err, doc) => {
    done(null,null);
  });
});
