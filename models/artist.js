var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var artistSchema = new Schema({
  artistName:       { type: String },
  artistStyles:     { type: String },
  artistThumbnail:  { data: Buffer, contentType: String },
  artistDesc:       { type: String },
  artistCountry:   	{ type: String }
});

module.exports = mongoose.model('Artist', artistSchema);