//File: controllers/artists.js
var mongoose = require('mongoose');
var Artist = require('../models/artist.js');

//GET - Return all artists in the DB
exports.findAllArtists = function(req, res) {
    Artist.find(function(err, artist) {
    if(err) res.send(500, err.message);

    console.log('GET /artists')
        res.status(200).jsonp(artist);
    }).populate('artistLinks');
};

//GET - Return a Artist with specified ID
exports.findArtistById = function(req, res) {
    Artist.findById(req.params.id, function(err, artist) {
    if(err) return res.send(500, err.message);

    console.log('GET /artists/' + req.params.id);
        res.status(200).jsonp(artist);
    }).populate('artistLinks');
};

//GET - Return a Artist with specified NAME
exports.findArtistByName = function(req, res) {
    Artist.find({artistName: req.params.id}, function(err, artist) {
    if(err) return res.send(500, err.message);

    console.log('GET /artistName/' + req.params.id);
        res.status(200).jsonp(artist);
    }).populate('artistLinks');
};

//POST - Insert a new Artist in the DB
exports.addArtist = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var artist 	= 	new Artist({
        artistName:     	req.body.artistName,
        artistStyles:   	req.body.artistStyles,
        artistThumbnail:    req.body.artistThumbnail,
        artistDesc:         req.body.artistDesc,
        artistCountry:      req.body.artistCountry,
        artistLinks:        req.body.artistLinks
    });

    artist.save(function(err, artist) {
        if(err) return res.send(500, err.message);
    res.status(200).jsonp(artist);
    });
};

//PUT - Update a register already exists
exports.updateArtist = function(req, res) {
    Artist.findById(req.params.id, function(err, artist) {
        artist.artistName          = req.body.artistName;
        artist.artistStyles  	   = req.body.artistStyles;
        artist.artistThumbnail     = req.body.artistThumbnail;
        artist.artistDesc          = req.body.artistDesc;
        artist.artistCountry       = req.body.artistCountry;
        artist.artistLinks         = req.body.artistLinks;

        artist.save(function(err) {
            if(err) return res.send(500, err.message);
      res.status(200).jsonp(artist);
        });
    });
};

//DELETE - Delete an artist with specified ID
exports.deleteArtist = function(req, res) {
    console.log('DELETE');
    console.log(req.body);

    Artist.findById(req.params.id, function(err, artist) {
        artist.remove(function(err) {
            if(err) return res.send(500, err.message);
      res.status(200);
        })
    });
};
