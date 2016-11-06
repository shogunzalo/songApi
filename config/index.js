/**
 * Created by gonzalo on 03-11-16.
 */

var env = process.env.NODE_ENV || 'development'
    , cfg = require('./config.'+env);

module.exports = cfg;