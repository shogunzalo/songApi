/* The API controller
*/

var Song = require('./models/song.js');
var Mix = require('./models/mix.js');
var Artist = require('./models/artist.js');
var Tracklist = require('./models/tracklist.js');

 
exports.postSong = function(req, res) {
    new Song({songName: req.body.songName, songArtist: req.body.songArtist, bpm: req.body.bpm, key: req.body.key, recordLabel: req.body.recordLabel, genre: req.body.genre, summary: req.body.summary}).save();
}

exports.postMix = function(req, res) {
    new Mix({songOne: req.body.songOne, songTwo: req.body.songTwo, recomendations: req.body.recomendations}).save();
}

exports.postArtist = function(req, res) {
    new Artist({artistName: req.body.artistName, artistStyles: req.body.artistStyles, artistThumbnail: req.body.artistThumbnail, artistDesc: req.body.artistDesc, artistCountry: req.body.artistCountry}).save();
}

exports.postTracklist = function(req, res) {
    new Trackist({title: req.body.title, author: req.body.author}).save();
}
 
exports.listSong = function(req, res) {
  Song.find(function(err, songs) {
    res.send(songs);
  });
}

exports.listMix = function(req, res) {
  Mix.find(function(err, mixs) {
    res.send(mixs);
  });
}

exports.listArtist = function(req, res) {
  Artist.find(function(err, artists) {
    res.send(artists);
  });
}

exports.listTracklist = function(req, res) {
  Tracklist.find(function(err, tracklists) {
    res.send(tracklists);
  });
}
 
// // first locates a thread by title, then locates the replies by thread ID.
// exports.show = (function(req, res) {
//     Thread.findOne({title: req.params.title}, function(error, thread) {
//         var posts = Post.find({thread: thread._id}, function(error, posts) {
//           res.send([{thread: thread, posts: posts}]);
//         });
//     })
// });