//File: controllers/songs.js
var mongoose = require('mongoose');
var Song = require('../models/song.js');
var Mix  = require('../models/mix.js');

exports.findSongByName = function(req, res) {
    Song.find({songName: req.params.id}, function(err, song) {
    if(err) return res.send(500, err.message);

    console.log('GET /songName/' + req.params.id);
        res.status(200).jsonp(song);
    });
};


// exports.findMixBySongName = function(req, res) {
//     Song.find({songName: req.params.id}, function(err, song) {     
//         var mixs = Mix.find({songOne: song._id}, function(error, mixs) {
//             res.send([{song: song, mixs: mixs}]);
//         });          
//     });
// };

exports.findMixBySongName = function(req, res) {
    
	Mix
		.find({songOne: req.params.id})
		.populate('songTwo')
		.exec(function (err, mix) {
		  if (err) return handleError(err);
		  console.log('The creator is %s', mix.songTwo.songName);
		})

};






// exports.findMixBySongName = function(req, res) {
//     Song.findById(req.params.id, function(err, song) {
//         var mixs = Mix.find({songOne: song._id}, function(error, mixs) {  

//         	 var i =0;
//         	 var songsFound = [];

//         	 mixs.forEach(function (error, doc){

//         	 	Song.findById(mixs[i].songTwo, function(err, song) {

//         	 		console.log('Found '+ i +" " + song.songName);
//         	 		console.log('Found array' + songsFound);
//         	 		songsFound[i] = song.songName;

//         	 	});
// 		   	 i++;

// 		     });

//             res.send([{songOne: song.songName, songTwo: songsFound}]);
//         });
//     })
// };

// var buscarNombre = function(idSong, res){

// Song.find({_id: idSong}, function(err, song) {
//             		console.log(song[0].songName);
//             		return(song[0].songName);
//             	});

// }