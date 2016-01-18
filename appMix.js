var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {
   res.send("Mix App!");
});

app.use(router);

app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/song', function(err, res) {
    if(err) throw err;
    console.log('Connected to mix Database');
});

// //Models and controllers

// var model = require('./models/song')(app, mongoose);


// var MixCtrl = require('./controllers/mixs');

// // API routes
// var mixs = express.Router();

// mixs.route('/mixs')
//   .get(MixCtrl.findAllMixs)
//   .post(MixCtrl.addMix);

// mixs.route('/mixs/:id')
//   .get(MixCtrl.findMixById)
//   .put(MixCtrl.updateMix)
//   .delete(MixCtrl.deleteMix);

// mixs.route('/songName/:id')
//   .get(MixCtrl.findMixByName)

// app.use('/api', mixs);