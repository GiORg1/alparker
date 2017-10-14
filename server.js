// server.js
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();

const port = 8000;

app.use('/webapp', express.static(__dirname + '/webapp')); //To load Web App
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  else console.log('Database connection estabilished');
  require('./app/routes')(app, database);
  app.listen(process.env.PORT || port , () => {
    console.log('We are live on ' + port);
  });
});
