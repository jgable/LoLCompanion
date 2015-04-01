var _ = require('lodash');
var Model = require('model');
var Store = require('store');

var config = require('../config');
var { region, apiKey } = config;

var SummonersStore = require('./summoners');

var GameModel = Model.extend({

});

var CurrentGameModel = GameModel.extend({
  url: function () {
    var region = 'NA1';
    var summonerId = this.get('summonerId');
    return `https://na.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/${region}/${summonerId}?api_key=${apiKey}`;
  }
});

var GamesStore = Store.extend({
  dispatcherEvents: {
    'games:load:current': 'fetchCurrentGame',
    'games:load:previous': 'fetchPreviousGames'
  },

  fetchCurrentGame: function (summonerId) {
    var currentGame = new CurrentGameModel({
      summonerId: summonerId
    });

    currentGame.fetch()
      .then(function () {
        var game = currentGame.toJSON();
        return this.fetchGameParticipants(game).then(function () {
          this.trigger('games:load:current:complete', game, summonerId);
        }.bind(this));
      }.bind(this), function (info) {
        this.trigger('games:load:current:error', info.err, info.origResponse, summonerId);
      }.bind(this));
  },

  fetchGameParticipants: function (game) {
    var summonerIds = _.pluck(game.participants, 'summonerId');
    return SummonersStore.fetch({
      url: `https://na.api.pvp.net/api/lol/na/v1.4/summoner/${summonerIds.join(',')}?api_key=${apiKey}`
    }, { remove: false });
  },

  fetchPreviousGames: function (summonerId) {
    this.fetch({
      url: `https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/${summonerId}/recent?api_key=${apiKey}`
    }, { remove: false }).then(function () {
      this.trigger('games:load:previous:complete', summonerId);
    }.bind(this), function (info) {
      this.trigger('games:load:previous:error', info.err, info.origResponse, summonerId);
    }.bind(this));
  }
});

module.exports = new GamesStore();
