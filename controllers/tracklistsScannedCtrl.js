/**
 * Created by gonzalo on 02-11-16.
 */
//File: controllers/artists.js
var mongoose = require('mongoose');
var TracklistsScanned = require('../models/tracklistsScanned.js');

// GET - Return a TracklistsScanned with specified URL
exports.findTracklistsScannedByUrl = function(req, res) {
    TracklistsScanned.find({tracklistUrl: req.params.id}, function(err, tracklistsScanned) {
        if(err) return res.send(500, err.message);

        console.log('GET /findTracklistsScannedByUrl/' + req.params.id);
        res.status(200).jsonp(tracklistsScanned);
    });
};

// GET - Return all TracklistsScanned in the DB
exports.findAllTracklistsScanned = function(req, res) {
    TracklistsScanned.find(function(err, tracklistsScanned) {
        if(err) res.send(500, err.message);

        console.log('GET /tracklistsScanned')
        res.status(200).jsonp(tracklistsScanned);
    });
};

// POST
exports.addTracklistScanned = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var tracklistsScanned = new TracklistsScanned({
        tracklistUrl:  req.body.tracklistUrl,
        tracklistActive:    true
    });

    tracklistsScanned.save(function(err, tracklistsScanned) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(tracklistsScanned);
    });
};
