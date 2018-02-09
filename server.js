// server.js
// where your node app starts

// init project
'use strict';
var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var routes = require('./app/routes/index.js');
var api = require('./app/api/url-shortener.js');
require('dotenv').config({
  silent: true
});

var app = express();

mongo.MongoClient.connect('mongodb://djy:123@ds229458.mlab.com:29458/fcc-shorten-urls', function(err, db) {
  if (err) {
    throw new Error('Database failed to connect!');
  } else {
    console.log('Successfully connected to MongoDB on port 29458.');
  }

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  db = db.db('fcc-shorten-urls');

  db.createCollection('sites', {
    capped: true,
    size: 5242880,
    max: 5000
  });
  
  routes(app, db);
  api(app, db);

  // Simple in-memory store for now
  var dreams = [
    "Find and count some sheep",
    "Climb a really tall mountain",
    "Wash the dishes"
  ];

  // listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
});
