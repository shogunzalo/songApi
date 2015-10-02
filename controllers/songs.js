//File: controllers/songs.js
var mongoose = require('mongoose');
var Song = require('../models/song.js');
var Artist = require('../models/artist.js');
var Link = require('../models/link.js');


//GET - Return all songs in the DB
exports.findAllSongs = function(req, res) {
    Song.find(function(err, songs) {
    if(err) res.send(500, err.message);

    console.log('GET /songs')
        res.status(200).jsonp(songs);
    }).populate({ path: 'songMixs songArtist songLinks' });
};

//GET TODO
// exports.findSongByName = function(req, res) {
//     Song.find({songName: req.params.id}, function(err, song){
//     if(err) return res.send(500, err.message);

//     console.log('GET /songName/' + req.params.id);
//         res.status(200).jsonp(song);
//     }).populate('songMixs songArtist');
// };

exports.findSongByName = function(req, res) {

Song.find({songName: req.params.id})
  .lean()
  .populate({ path: 'songMixs songArtist songLinks' })
  .exec(function(err, docs) {

    var options = {
      path: 'songMixs.nextSong',
      model: 'Song'
    };

    if (err) return res.json(500);
    Song.populate(docs, options, function (err, projects) {

        var options2 = {
            path: 'songMixs.nextSong.songArtist',
            model: 'Artist'
        };

        var options3 = {
            path: 'songMixs.nextSong.songLinks',
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


//GET - Return a Song with specified ID
exports.findSongById = function(req, res) {
    Song.findById(req.params.id, function(err, song) {
    if(err) return res.send(500, err.message);

    console.log('GET /song/' + req.params.id);
        res.status(200).jsonp(song);
    });
};

//POST - Insert a new Song in the DB
exports.addSong = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var song 	= 	new Song({
        songName:     	req.body.songName,
        songArtist:   	req.body.songArtist,
        bpm:  	  		req.body.bpm,
        key:   	  		req.body.key,
        songPublisher:    req.body.songPublisher,
        genre:    		req.body.genre,
        summary:  		req.body.summary,
        songMixs:       req.body.songMixs,
        songLinks:      req.body.songLinks
    });

    song.save(function(err, song) {
    // if(err) return res.send(500, err.message);
    if(err) return res.status(500).send(err.message);
    res.status(200).jsonp(song);
    });
};

//PUT - Update a register already exists
exports.updateSong = function(req, res) {
    Song.findById(req.params.id, function(err, song) {
        song.songName     = req.body.songName;
        song.songArtist   = req.body.songArtist;
        song.bpm          = req.body.bpm;
        song.key          = req.body.key;
        song.songPublisher  = req.body.songPublisher;
        song.genre   	  = req.body.genre;
        song.summary      = req.body.summary;
        song.songMixs     = req.body.songMixs;
        song.songLinks    = req.body.songLinks;
        song.save(function(err) {
            if(err) return res.status(500).send(err.message);
      res.status(200).jsonp(song);
        });
    });
};

// Contact.update({_id: info._id}, {$push: {"messages": {title: title, msg: msg}}}, fun

//PUT - Update a register already exists
exports.addMixs = function(req, res) {
    Song.update({_id: req.params.id}, {$push: {"songMixs": req.body.songMixs}}, function(err, song) {
      if(err) return res.status(500).send(err.message);
      res.status(200).jsonp(song);
    });
};

// //PUT - Update a register already exists
// exports.addMixs = function(req, res) {
//     Song.findById(req.params.id, function(err, song) {
//         song.push({ songMixs: req.body.songMixs });
//         // song.push(req.body.songMixs);
//         song.save(function(err) {
//             if(err) return res.send(500, err.message);
//       res.status(200).jsonp(song);
//         });
//     });
// };

//DELETE - Delete a Song with specified ID
exports.deleteSong = function(req, res) {
    Song.findById(req.params.id, function(err, song) {
        song.remove(function(err) {
            if(err) return res.send(500, err.message);
      res.status(200);
        })
    });
};
