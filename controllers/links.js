//File: controllers/links.js
var mongoose = require('mongoose');
var Link = require('../models/link.js');

//POST - Insert a new Artist in the DB
exports.addLinks = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var Links 	= 	new Link({
        soundCloudLink:  req.body.soundCloudLink,
        beatPortLink:    req.body.beatPortLink,
        facebookLink:    req.body.facebookLink,
        websiteLink:     req.body.websiteLink,
        twitterLink:     req.body.twitterLink,
        youtubeLink:     req.body.youtubeLink,
        mixcloudLink:     req.body.mixcloudLink
    });

    Links.save(function(err, Links) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(Links);
    });
};