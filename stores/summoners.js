var _ = require('lodash');
var Fluxbone = require('react-native-fluxbone');
var { Model, Store } = Fluxbone;

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

    return resp[this.id] || resp;
  }
});

var SummonersStore = Store.extend({
  model: SummonerModel,

  dispatcherEvents: {
    'summoner:load': 'loadInitial'
  },

  parse: function (resp) {
    if (_.isObject(resp)) {
      return _.values(resp);
    }

    return resp;
  },

  loadInitial: function (name) {
    var model = new SummonerModel({
      name: name
    });

    model.fetch()
      .then(function () {
        this.add(model);
        this.trigger('summoner:load:complete', model);
      }.bind(this), (err) => this.trigger('summoner:load:error', err, name));
  },

  getByName: function (name) {
    return this.getSingleWhere({
      name: name
    });
  },

  getAll: function (ids) {
    return ids.map((id) => this.get(id));
  },
});

module.exports = new SummonersStore();

var fakeParticipantsData = {
  "25376276": {
    "id": 25376276,
    "name": "Reecedude21",
    "profileIconId": 657,
    "summonerLevel": 30,
    "revisionDate": 1428296148000
  },
  "30101782": {
    "id": 30101782,
    "name": "VikingPrincess",
    "profileIconId": 778,
    "summonerLevel": 30,
    "revisionDate": 1428296148000
  },
  "38328038": {
    "id": 38328038,
    "name": "Silentwolf3794",
    "profileIconId": 25,
    "summonerLevel": 20,
    "revisionDate": 1428296148000
  },
  "51470097": {
    "id": 51470097,
    "name": "SheIsShy",
    "profileIconId": 688,
    "summonerLevel": 30,
    "revisionDate": 1428296148000
  },
  "52340493": {
    "id": 52340493,
    "name": "Scrattisimus",
    "profileIconId": 28,
    "summonerLevel": 20,
    "revisionDate": 1428296148000
  },
  "57414867": {
    "id": 57414867,
    "name": "jgable",
    "profileIconId": 10,
    "summonerLevel": 25,
    "revisionDate": 1428296148000
  },
  "61285753": {
    "id": 61285753,
    "name": "Jonesiee",
    "profileIconId": 4,
    "summonerLevel": 6,
    "revisionDate": 1428296148000
  },
  "65203908": {
    "id": 65203908,
    "name": "Thornrack",
    "profileIconId": 785,
    "summonerLevel": 22,
    "revisionDate": 1428296148000
  },
  "65369656": {
    "id": 65369656,
    "name": "ThrobJohnson",
    "profileIconId": 20,
    "summonerLevel": 12,
    "revisionDate": 1428296148000
  },
  "66279845": {
    "id": 66279845,
    "name": "Azdregath",
    "profileIconId": 657,
    "summonerLevel": 25,
    "revisionDate": 1428296148000
  }
};
