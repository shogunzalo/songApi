var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var genreSchema = new Schema({
    genreName:     { type: String }
});

module.exports = mongoose.model('Genre', genreSchema);