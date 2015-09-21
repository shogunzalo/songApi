var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var linkSchema = new Schema({
    soundCloudLink:     { type: String },
    beatPortLink:     { type: String },
    facebookLink:     { type: String },
    websiteLink:      { type: String },
    twitterLink:      { type: String },
    youtubeLink:      { type: String },
    mixcloudLink:      { type: String }
});

module.exports = mongoose.model('Link', linkSchema);