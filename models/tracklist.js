var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var tracklistSchema = new Schema({
  tracklistArtist:      [{type : Schema.Types.ObjectId, ref : 'Artist'}],
  tracklistName:        { type: String },
  tracklistdate:        { type: String },
  tracklistTracks:      [{trackNumber: {type: String}, track: {type : Schema.Types.ObjectId, ref : 'Song'}}],
  tracklistLinks:    	{type : Schema.Types.ObjectId, ref : 'Link'},
  tracklistGenres:      [{type : Schema.Types.ObjectId, ref : 'Genre'}]

});

module.exports = mongoose.model('Tracklist', tracklistSchema);