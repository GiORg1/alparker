var express = require('express');
const MongoClient = require('mongodb').MongoClient;

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
/*
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/images'));

// views is directory for all template files
app.set('views', __dirname + '/views');
// set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});

*/

// Load mongoose package
var mongoose = require('mongoose');
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://parker:parker@ds119685.mlab.com:19685/elparker');
// Create a schema

//exmpl
//{id:"1f32sd02", llg:{lat:41.3900827984977,lng:2.1572095155715942},sns:0,ang:135}


var carSchema = new mongoose.Schema({
  llg: {lat: Number, lng: Number},
  sns: Number,
  ang: Number,
}, { collection : 'real_cars' });

// Create a model based on the schema
var Car = mongoose.model('Car', carSchema);

// Find all data in the Todo collection


app.use('/real_cars', function (req, res, next) {
  console.log('Request Type:', req.method);

	Car.find(function (err, real_cars) {
		if(err) res.send(err);
		res.json(real_cars);
	});



});


app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});