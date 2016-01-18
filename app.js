var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
//var bodyParser   = require('body-parser');
var session      = require('express-session');

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'jsp'); // set up jsp for templating

// required for passport
app.use(session({ secret: 'nextsongsecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================

require('./config/passport')(passport); // pass passport for configuration
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//=======================================================

var router = express.Router();

router.get('/', function(req, res) {
   res.send("Mix App!");
});

app.use(router);
app.use(express.static(__dirname + '/resources')); //DECLARE STATIC DIR

//NEW
 
// set up the RESTful API, handler methods are defined in api.js
var apiSong = require('./controllers/songs.js');
var apiMix = require('./controllers/mixs.js');
var apiArtist = require('./controllers/artists.js');
var apiSongArtist = require('./controllers/songArtist.js');
var apiTracklist = require('./controllers/tracklists.js');
var apiLinks = require('./controllers/links.js');
var apiGenres = require('./controllers/genres.js');
var apiImages = require('./controllers/images.js');


// var apiSongMix = require('./controllers/songMix.js');
// var apiTracklist = require('./controllers/tracklists.js');

//POST
app.post('/song', apiSong.addSong);
app.post('/artist', apiArtist.addArtist);
app.post('/mix', apiMix.addMix);
app.post('/tracklist', apiTracklist.addTracklist);
app.post('/links', apiLinks.addLinks);
app.post('/genre', apiGenres.addGenres);
app.post('/webCrawler', apiTracklist.webCrawler);
app.post('/saveImage', apiImages.saveImage)

//PUT
app.put('/addMix/:id', apiSong.addMixs);
//Plan to use this one for the mix as posts
app.put('/addMix/:id', apiMix.addMixs);
app.put('/addRecommendations/:id', apiMix.addRecommendations);
app.put('/addArtistToTracklist/:id', apiTracklist.addArtists);
app.put('/addGenresToTracklist/:id', apiTracklist.addGenres);
app.put('/addSongsToTracklist/:id', apiTracklist.addSongs);



//GET
app.get('/home', function(req,res){
 res.sendfile(__dirname + '/views/index.html');
});

app.get('/admin', function(req,res){
 res.sendfile(__dirname + '/views/admin.html');
});

app.get('/artistInfo', function(req,res){
    res.sendfile(__dirname + '/views/artistInfo.html');
});

app.get('/tracklistInfo', function(req,res){
    res.sendfile(__dirname + '/views/tracklistInfo.html');
});

app.get('/test', function(req,res){
    res.sendfile(__dirname + '/views/test.html');
});

app.get('/song', apiSong.findAllSongs);
app.get('/artist', apiArtist.findAllArtists);
app.get('/songName/:id', apiSong.findSongByName);
app.get('/artistName/:id', apiArtist.findArtistByName);
app.get('/artistById/:id', apiArtist.findArtistById);
app.get('/mix', apiMix.findAllMixs);
app.get('/mix/:id', apiMix.findMixBySongId);
app.get('/tracklists', apiTracklist.findAllTracklists);
app.get('/tracklistByName/:id', apiTracklist.findTracklistByName);
app.get('/tracklistByArtist/:id', apiTracklist.findTracklistByArtist);
app.get('/genreByName/:id', apiGenres.findGenreByName);
app.get('/genres/', apiGenres.findAllGenres);
app.get('/imageName/:id', apiImages.findImageByName);




app.get('/artistSongs/:id', apiSongArtist.showArtistSongs);
// app.get('/songMix/:id', apiSongMix.findMixBySongName);


//DELETE
app.delete('/song/:id', apiSong.deleteSong);
app.delete('/artist/:id', apiArtist.deleteArtist);
app.delete('/mix/:id', apiMix.deleteMix);

//FIND BY ID
app.get('/song/:id', apiSong.findSongById);
app.get('/artist/:id', apiArtist.findArtistById);

app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

// connect to Mongo when the app initializes
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/song', function(err, res) {
    if(err) throw err;
    console.log('Connected to mix Database');
});