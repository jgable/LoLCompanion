/**
 * @providesModule backbone
 */

var Backbone = require('backbone-lodash');
var registerFetchSync = require('./backbone-sync-fetch.js');

registerFetchSync(Backbone);

module.exports = Backbone;
