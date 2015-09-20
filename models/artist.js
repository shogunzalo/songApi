var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var artistSchema = new Schema({
  artistName:       { type: String },
  artistStyles:     { type: String },
  artistThumbnail:  { data: Buffer, contentType: String },
  artistDesc:       { type: String },
  artistCountry:   	{ type: String },
  artistLinks:   	{type : Schema.Types.ObjectId, ref : 'ArtistLink'}
});

module.exports = mongoose.model('Artist', artistSchema);