/**
 * @providesModule model
 */

var _ = require('lodash');
var Backbone = require('backbone');

var handleDispatcherEvents = require('./dispatcherEvents');

// @class Model
var Model = Backbone.Model.extend({
  initialize: function() {
    this.registerDispatcherEvents();
  }
});

_.extend(Model.prototype, handleDispatcherEvents);

module.exports = Model;
