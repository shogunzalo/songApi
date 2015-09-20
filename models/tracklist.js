var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var tracklistSchema = new Schema({
  tracklistArtist:      {type : Schema.Types.ObjectId, ref : 'Artist'},
  tracklistName:        { type: String },
  date:                 { type: String },
  tracks:               [{type : Schema.Types.ObjectId, ref : 'Song'}],
  links:    	        { type: String }
});

module.exports = mongoose.model('Tracklist', tracklistSchema);