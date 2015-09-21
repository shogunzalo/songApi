//File: controllers/songs.js
var mongoose = require('mongoose');
var Song = require('../models/song.js');
var Artist = require('../models/artist.js');

//GET - Return all songs in the DB
// exports.findAllSongs = function(req, res) {
//     Song.find(function(err, songs) {
//     if(err) res.send(500, err.message);

//     console.log('GET /songs')
//         res.status(200).jsonp(songs);
//     });
// };

exports.showArtistSongs = function(req, res) {
    Artist.findById(req.params.id, function(err, artist) {
        if(err) res.send(500, err.message);
        if(artist != undefined){
            var songs = Song.find({songArtist: artist._id}, function(err, songs) {
                if(err) res.send(500, err.message);
                var varSongs = [];
                for (var i=0, len=songs.length; i<len; i++){
                varSongs[i] = songs[i];
                }
                res.send([{songArtist: artist.artistName, songs: varSongs}]);
            });
        }else{
            res.send(500, "Error.")
        }

    });
};

//TODO: Return song with name?

//GET - Return a Song with specified ID
// exports.findSongById = function(req, res) {
//     Song.findById(req.params.id, function(err, song) {
//     if(err) return res.send(500, err.message);

//     console.log('GET /song/' + req.params.id);
//         res.status(200).jsonp(song);
//     });
// };

// exports.findMixByName = function(req, res) {
//     Mix.find({songOne: req.params.id}, function(err, mix) {
//     if(err) return res.send(500, err.message);

//     console.log('GET /songName/' + req.params.id);
//         res.status(200).jsonp(mix);
//     });
// };