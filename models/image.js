/**
 * Created by Gonzalo on 10/23/15.
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var imageSchema = new Schema({
    imageName: { type: String },
    img: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('Image', imageSchema);