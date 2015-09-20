var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var mixSchema = new Schema({
  //TODO: This should be a post
    nextSong: {type : Schema.Types.ObjectId, ref : 'Song'},
    recommendations:     [{ comments: {type: String }, rating: {type: Number }}]
  //TODO: Seen in
});

module.exports = mongoose.model('Mix', mixSchema);