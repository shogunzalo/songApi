//File: controllers/mixs.js
var mongoose = require('mongoose');
var Mix = require('../models/mix.js');

//GET - Return all mixs in the DB
exports.findAllMixs = function(req, res) {
    Mix.find(function(err, mixs) {
    if(err) res.send(500, err.message);

    console.log('GET /mixs')
        res.status(200).jsonp(mixs);
    });
};

//GET - Return a Mix with specified ID
exports.findMixById = function(req, res) {
    Mix.findById(req.params.id, function(err, mix) {
    if(err) return res.send(500, err.message);

    console.log('GET /mixs/' + req.params.id);
        res.status(200).jsonp(mix);
    });
};

//GET - Return a Mix with a song ID
exports.findMixBySongId = function(req, res) {
    Mix.find({songOne: req.params.id}, function(err, mix) {
    if(err) return res.send(500, err.message);

    console.log('GET /songName/' + req.params.id);
        res.status(200).jsonp(mix);
    });
};

// //GET - Return a Mix with specified NAME
// exports.findMixByName = function(req, res) {
//     Mix.find({songOne: req.params.id}, function(err, mix) {
//     if(err) return res.send(500, err.message);

//     console.log('GET /songName/' + req.params.id);
//         res.status(200).jsonp(mix);
//     });
// };

//POST - Insert a new Mix in the DB
exports.addMix = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var mix 	= 	new Mix({
        nextSong: req.body.nextSong,
        recommendations: [{
        comments: req.body.comments,
        rating: req.body.rating
        }]
    });

    mix.save(function(err, mix) {
        if(err) return res.send(500, err.message);
    res.status(200).jsonp(mix);
    });
};


//PUT
exports.addMixs = function(req, res) {
    Mix.update({_id: req.params.id}, {$push: {"nextSong": req.body.nextSong}}, function(err, mix) {
        if(err) return res.status(500).send(err.message);
        res.status(200).jsonp(mix);
    });
};

exports.addRecommendations = function(req, res) {
    Mix.update({_id: req.params.id}, {$push: {"recommendations": {
        comments: req.body.comments,
        rating: req.body.rating
    }}
    }, function(err, mix) {
        if(err) return res.status(500).send(err.message);
        res.status(200).jsonp(mix);
    });
};

//PUT - Update a register already exists
exports.updateMix = function(req, res) {
    Mix.findById(req.params.id, function(err, mix) {
        mix.songOne           = req.body.songOne;
        mix.songTwo  	      = req.body.songTwo;
        mix.recomendations    = req.body.recomendations;

        mix.save(function(err) {
            if(err) return res.send(500, err.message);
      res.status(200).jsonp(mix);
        });
    });
};

//DELETE - Delete a Mix with specified ID
exports.deleteMix = function(req, res) {
    console.log('DELETE');
    console.log(req.body);

    Mix.findById(req.params.id, function(err, mix) {
        mix.remove(function(err) {
            if(err) return res.send(500, err.message);
      res.status(200);
        })
    });
};
