//File: controllers/genres.js
var mongoose = require('mongoose');
var Genre = require('../models/genre.js');

//POST - Insert a new Genre in the DB
exports.addGenres = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var Genres 	= 	new Genre({
        genreName:  req.body.genreName
    });

    Genres.save(function(err, Genres) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(Genres);
    });
};

//GET - Return a Genre with specified NAME
exports.findGenreByName = function(req, res) {
    Genre.find({genreName: req.params.id}, function(err, genre) {
        if(err) return res.send(500, err.message);

        console.log('GET /genreName/' + req.params.id);
        res.status(200).jsonp(genre);
    });
};

//GET - Return all artists in the DB
exports.findAllGenres = function(req, res) {
    Genre.find(function(err, genre) {
        if(err) res.send(500, err.message);

        console.log('GET /genres')
        res.status(200).jsonp(genre);
    });
};
