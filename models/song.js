//The song schema

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var songSchema = new Schema({
  songName:       { type: String },
  songArtist:     [{type : Schema.Types.ObjectId, ref : 'Artist'}],
  //Change to int
  bpm:            { type: String },
  //Need fixed keys
  key:            { type: String },
  songPublisher:    { type: String },
  //Need predefined genres
  genre:          { type: String },
  summary:        { type: String },
  songMixs:       [{type : Schema.Types.ObjectId, ref : 'Mix'}],
  songLinks:      {type : Schema.Types.ObjectId, ref : 'Link'}
});

module.exports = mongoose.model('Song', songSchema);