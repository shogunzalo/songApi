/**
 * Created by gonzalo on 26-07-15.
 */
//File: controllers/songs.js
var mongoose = require('mongoose');
var Tracklist = require('../models/tracklist.js');
var Mix  = require('../models/mix.js');

//GET - Return all tracklists in the DB
exports.findAllTracklists = function(req, res) {
    Tracklist.find(function(err, tracklist) {
        if(err) res.send(500, err.message);

        console.log('GET /tracklists')
        res.status(200).jsonp(tracklist);
    });
};

//GET - Return tracklists by artist
exports.findTracklistByArtist = function(req, res) {
    Tracklist.find({tracklistArtist: req.params.id})
    //    .lean()
        .populate('tracks')
        .exec(function(err, docs)
     {
            res.json(docs);
    });
};

//GET - Return tracklists by name
exports.findTracklistByName = function(req, res) {
    Tracklist.find({tracklistName: req.params.id})
        //    .lean()
        .populate('tracks')
        .exec(function(err, docs)
        {
            res.json(docs);
        });
};

//exports.findSongByName = function(req, res) {
//
//    Song.find({songName: req.params.id})
//        .lean()
//        .populate({ path: 'songMixs songArtist' })
//        .exec(function(err, docs) {
//
//            var options = {
//                path: 'songMixs.nextSong',
//                model: 'Song'
//            };
//
//            if (err) return res.json(500);
//            Song.populate(docs, options, function (err, projects) {
//
//                var options2 = {
//                    path: 'songMixs.nextSong.songArtist',
//                    model: 'Artist'
//                };
//
//                Artist.populate(docs, options2, function (err, projects) {
//                    res.json(projects);
//                });
//            });
//        });
//
//};

//POST - Insert a new Tracklist in the DB
exports.addTracklist = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var tracklist 	= 	new Tracklist({
        tracklistArtist:    [],
        tracklistGenres:    req.body.tracklistGenres,
        tracklistName:   	req.body.tracklistName,
        tracklistDate:  	req.body.date,
        tracklistTracks:   	req.body.tracks,
        tracklistLinks:     req.body.tracklistLinks
    });

    req.body.tracklistArtist.forEach(function(element){
        tracklist.tracklistArtist.push(JSON.parse(element));
    });


    console.log(tracklist.tracklistArtist);

    tracklist.save(function(err, tracklist) {
        // if(err) return res.send(500, err.message);
        if(err){
            console.log(err.message);
            return res.status(500).send(err.message);
        }
        console.log(tracklist);
        res.status(200).jsonp(tracklist);
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