/**
 * Created by Gonzalo on 10/22/15.
 */

//File: controllers/links.js
var mongoose = require('mongoose');
var Image = require('../models/image.js');
var http = require("http");


exports.findImage = function(req, res) {
    Image.find({imageName: req.params.id}, function(err, images) {
        if(err) return res.send(500, err.message);
        console.log('GET /image/' + req.params.id);
        res.contentType(images.img.contentType);
        res.send(images.img.data);
    });

};

exports.findImageByName = function(req, res) {
    Image.findOne({imageName: req.params.id}, function(err, images) {
        if(err) return res.send(500, err.message);
        if(images == null) return res.send(404, "Error");

        console.log('GET /imageName/' + req.params.id);
        //res.status(200).jsonp(images);
        res.contentType(images.img.contentType);
        res.send(images.img.data);

    });
};

//Genre.find({genreName: req.params.id}, function(err, genre) {
//    if(err) return res.send(500, err.message);
//
//    console.log('GET /genreName/' + req.params.id);
//    res.status(200).jsonp(genre);
//});


exports.saveImage = function(req, res1) {
    // store an img in binary in mongo

    var imgPath = req.body.imgUrl;

    console.log(req.body);

    http.get(imgPath, function(res) {

        var buffers = [];
        var length = 0;

        res.on("data", function(chunk) {

            // store each block of data
            length += chunk.length;
            buffers.push(chunk);

        });

        res.on("end", function() {

            // combine the binary data into single buffer
            var image = Buffer.concat(buffers);

            // determine the type of the image
            // with image/jpeg being the default
            var type = 'image/jpeg';
            if (res.headers['content-type'] !== undefined)
                type = res.headers['content-type'];

            //save_to_db(type, image);

            var a = new Image;
            a.imageName = req.body.imageName;
            a.img.data = image;
            a.img.contentType = 'image/png';
            a.save(function (err, a) {
                if (err) throw err;
                console.error('saved img to mongo');
                console.log(a._id);
                res1.status(200).jsonp(a);

            });

        });

    });
};