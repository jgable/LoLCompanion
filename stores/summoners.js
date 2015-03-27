var _ = require('lodash');
var Model = require('model');
var Store = require('store');

var config = require('../config');

var SummonerModel = Model.extend({
  urlRoot: function () {
    return 'https://na.api.pvp.net/api/lol/' + config.region + '/v1.4/summoner/';
  },

  url: function () {
    // A little trickery here because of different endpoints for name and id
    var url = _.result(this, 'urlRoot');
    var name = this.get('name');
    if (name) {
      url += 'by-name/' + name;
    } else {
      url += this.id;
    }

    // Append the api key from the config
    url += '?api_key=' + config.apiKey;

    return url;
  },

  parse: function (resp) {
    var name = this.get('name');
    if (name && resp[name]) {
      return resp[name];
    }

    return resp[this.id];
  }
});

var SummonersStore = Store.extend({
  model: SummonerModel,

  dispatcherEvents: {
    'summoner:load': 'loadInitial'
  },

  loadInitial: function (name) {
    var model = new SummonerModel({
      name: name
    });

    model.fetch()
      .then(function () {
        this.add(model);
        this.trigger('summoner:load:complete', model);
      }.bind(this), function () {
        this.trigger('summoner:load:error', name);
      }.bind(this));
  },

  getByName: function (name) {
    return this.getSingleWhere({
      name: name
    });
  }
});

module.exports = new SummonersStore();
