/**
 * Created by gonzalo on 02-11-16.
 */
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var tracklistsScannedSchema = new Schema({
    tracklistUrl: {type: String},
    tracklistActive: {type: Boolean}
});

module.exports = mongoose.model('TracklistsScanned', tracklistsScannedSchema);