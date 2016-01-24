/**
 * Created by gonzalo on 26-07-15.
 */
//File: controllers/songs.js
var mongoose = require('mongoose');
//var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Tracklist = require('../models/tracklist.js');
var Song = require('../models/song.js');
var Link = require('../models/link.js');
var Artist = require('../models/artist.js');
var Mix  = require('../models/mix.js');
var sys = require('sys')
var exec = require('child_process').exec;

//POST
exports.webCrawler = function(req, res){
    exec("(rm /Users/Gonzalo/Documents/webCrawler/djTest/djTest/tracklist.json; cd /Users/Gonzalo/Documents/webCrawler/djTest/djTest/; scrapy crawl 1001tracklists -o tracklist.json -a start_url="+ req.body.url +")", function (error, stdout, stderr) {
    //exec("(rm /opt/djCrawler/djCrawler/tracklist.json; cd /opt/djCrawler/djCrawler/; scrapy crawl 1001tracklists -o tracklist.json -a start_url="+ req.body.url +")", function (error, stdout, stderr) {

            exec("cat /Users/Gonzalo/Documents/webCrawler/djTest/djTest/tracklist.json", function (error, stdout, stderr) {
            //exec("cat /opt/djCrawler/djCrawler/tracklist.json", function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                res.status(200).jsonp(stdout);
            });
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
}

//GET - Return all tracklists in the DB
exports.findAllTracklists = function(req, res) {
    Tracklist.find(function(err, tracklist) {
        if(err) res.send(500, err.message);

        console.log('GET /tracklists')
        res.status(200).jsonp(tracklist);
    }).populate('tracklistArtist tracklistGenres tracklistLinks tracklistTracks.track');
};

//GET - Return tracklists by artist
exports.findTracklistByArtist = function(req, res) {
    Tracklist.find({tracklistArtist: req.params.id})
    //    .lean()
        .populate('tracklistArtist tracklistGenres tracklistLinks tracklistTracks.track')
        .exec(function(err, docs)
     {
            res.json(docs);
    });
};

//GET - Return tracklists by name
exports.findTracklistByName = function(req, res) {
    Tracklist.find({tracklistName: req.params.id})
        //    .lean()
        .populate('tracklistArtist tracklistGenres tracklistLinks tracklistTracks.track')
        .exec(function(err, docs)
        {
            var options = {
                path: 'tracklistTracks.track',
                model: 'Song'
            };

            if (err) return res.json(500);

            Song.populate(docs, options, function (err, projects) {

                var options2 = {
                    path: 'tracklistTracks.track.songArtist',
                    model: 'Artist'
                };

                var options3 = {
                    path: 'tracklistTracks.track.songLinks',
                    model: 'Link'
                };

                Link.populate(docs, options3, function (err, projects) {
                });

                Artist.populate(docs, options2, function (err, projects) {
                    res.json(projects);
                });
            });
        });
};

//PUT - Update a register already exists
exports.updateTracklist = function(req, res) {
    Tracklist.findById(req.params.id, function(err, tracklist) {
        tracklist.tracklistArtist     = req.body.tracklistArtist;
        tracklist.tracklistGenres     = req.body.tracklistGenres;
        tracklist.tracklistName       = req.body.tracklistName;
        tracklist.tracklistDate       = req.body.date;
        tracklist.tracklistTracks.trackNumber     = req.body.trackNumber;
        tracklist.tracklistTracks.songIndex     = req.body.songIndex;
        tracklist.tracklistTracks.track     = req.body.track;
        tracklist.tracklistLinks   	  = req.body.genre;

        tracklist.save(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).jsonp(tracklist);
        });
    });
};

exports.addSongs = function(req, res) {
    console.log(req.body);
    console.log(req.params.id);
    Tracklist.update({_id: req.params.id}, {$push: {"tracklistTracks": {"track": req.body.tracklistTracks, "trackNumber": req.body.trackNumber, "songIndex": req.body.songIndex}}
    }, function(err, tracklist) {
        if(err){
            console.log(err.message);
            return res.status(500).send(err.message);
        }
        res.status(200).jsonp(tracklist);
    });
};

exports.addGenres = function(req, res) {
    console.log(req.body);
    console.log(req.params.id);
    Tracklist.update({_id: req.params.id}, {$push: {"tracklistGenres": req.body.tracklistGenres}
    }, function(err, tracklist) {
        if(err){
            console.log(err.message);
            return res.status(500).send(err.message);
        }
        res.status(200).jsonp(tracklist);
    });
};

exports.addArtists = function(req, res) {
    console.log(req.body);
    console.log(req.params.id);
    Tracklist.update({_id: req.params.id}, {$push: {"tracklistArtist": req.body.tracklistArtist}
    }, function(err, tracklist) {
        if(err){
            console.log(err.message);
            return res.status(500).send(err.message);
        }
        res.status(200).jsonp(tracklist);
    });
};

//POST - Insert a new Tracklist in the DB
exports.addTracklist = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var tracklist 	= 	new Tracklist({
        tracklistName:   	req.body.tracklistName,
        tracklistDate:  	req.body.date,
        tracklistLinks:     req.body.tracklistLinks
    });

    //JSON.parse(req.body.tracklistArtist).forEach(function(element){
    //    console.log(element);
    //    tracklist.tracklistArtist.push(element);
    //});

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

//exports.findMixBySongName = function(req, res) {
//
//    Mix
//        .find({songOne: req.params.id})
//        .populate('songTwo')
//        .exec(function (err, mix) {
//            if (err) return handleError(err);
//            console.log('The creator is %s', mix.songTwo.songName);
//        })
//
//};






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