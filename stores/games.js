var _ = require('lodash');
var Fluxbone = require('react-native-fluxbone');
var { Model, Store } = Fluxbone;

var config = require('../config');
var { region, apiKey } = config;

var SummonersStore = require('./summoners');

var GameModel = Model.extend({

});

var CurrentGameModel = GameModel.extend({
  idAttribute: 'gameId',
  url: function () {
    var region = 'NA1';
    var summonerId = this.get('summonerId');
    return `https://na.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/${region}/${summonerId}?api_key=${apiKey}`;
  },

  testFetch: function () {
    this.set(fakeCurrentGameData);
    return new Promise((resolve) => resolve());
  }
});

var GamesStore = Store.extend({
  idAttribute: 'gameId',
  dispatcherEvents: {
    'games:load:current': 'fetchCurrentGame',
    'games:load:previous': 'fetchPreviousGames'
  },

  fetchCurrentGame: function (summonerId) {
    this.currentGame = this.currentGame || new CurrentGameModel({
      summonerId: summonerId
    });

    console.log('currentGame.fetch', summonerId);
    return this.currentGame.fetch()
      .then(()  => {
        this.add(this.currentGame);
        var game = this.currentGame.toJSON();
        console.log('currentGame.fetch success', this.currentGame.id, game);
        return this.fetchGameParticipants(game).then(() => {
          console.log('participants.fetch success', game.gameId);
          this.trigger('games:current:changed', game.gameId);
        });
      }, (info) => {
        console.log('currentGame.fetch err', info.origResponse);
        this.trigger('games:current:changed', null);
      });
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
  },

  pollForCurrentGame: function (summonerId) {
    var again = this.pollForCurrentGame.bind(this, summonerId);
    this.currGameTimer = setTimeout(
      function () {
        this.fetchCurrentGame(summonerId).then(again, again);
      }.bind(this), 3000);
  },

  stopPollingCurrentGame: function () {
    clearInterval(this.currGameTimer);
  }
});

module.exports = new GamesStore();

var fakeCurrentGameData = {
  "summonerId": 57414867,
  "gameId": 1785963794,
  "mapId": 12,
  "gameMode": "ARAM",
  "gameType": "MATCHED_GAME",
  "gameQueueConfigId": 65,
  "participants": [
    {
      "teamId": 100,
      "spell1Id": 7,
      "spell2Id": 4,
      "championId": 84,
      "profileIconId": 657,
      "summonerName": "Azdregath",
      "bot": false,
      "summonerId": 66279845,
      "runes": [
        {
          "count": 1,
          "runeId": 5077
        },
        {
          "count": 3,
          "runeId": 5289
        },
        {
          "count": 4,
          "runeId": 5317
        }
      ],
      "masteries": [
        {
          "rank": 4,
          "masteryId": 4113
        },
        {
          "rank": 1,
          "masteryId": 4121
        },
        {
          "rank": 3,
          "masteryId": 4123
        },
        {
          "rank": 1,
          "masteryId": 4133
        },
        {
          "rank": 3,
          "masteryId": 4134
        },
        {
          "rank": 3,
          "masteryId": 4143
        },
        {
          "rank": 1,
          "masteryId": 4144
        },
        {
          "rank": 3,
          "masteryId": 4152
        },
        {
          "rank": 1,
          "masteryId": 4154
        },
        {
          "rank": 1,
          "masteryId": 4162
        },
        {
          "rank": 1,
          "masteryId": 4311
        },
        {
          "rank": 3,
          "masteryId": 4312
        }
      ]
    },
    {
      "teamId": 100,
      "spell1Id": 7,
      "spell2Id": 4,
      "championId": 86,
      "profileIconId": 28,
      "summonerName": "Scrattisimus",
      "bot": false,
      "summonerId": 52340493,
      "runes": [],
      "masteries": [
        {
          "rank": 1,
          "masteryId": 4111
        },
        {
          "rank": 2,
          "masteryId": 4112
        },
        {
          "rank": 2,
          "masteryId": 4113
        },
        {
          "rank": 1,
          "masteryId": 4114
        },
        {
          "rank": 1,
          "masteryId": 4124
        },
        {
          "rank": 2,
          "masteryId": 4212
        },
        {
          "rank": 2,
          "masteryId": 4213
        },
        {
          "rank": 2,
          "masteryId": 4222
        },
        {
          "rank": 2,
          "masteryId": 4312
        },
        {
          "rank": 2,
          "masteryId": 4313
        },
        {
          "rank": 2,
          "masteryId": 4322
        },
        {
          "rank": 1,
          "masteryId": 4324
        }
      ]
    },
    {
      "teamId": 100,
      "spell1Id": 7,
      "spell2Id": 21,
      "championId": 44,
      "profileIconId": 785,
      "summonerName": "Thornrack",
      "bot": false,
      "summonerId": 65203908,
      "runes": [
        {
          "count": 3,
          "runeId": 5003
        },
        {
          "count": 3,
          "runeId": 5045
        },
        {
          "count": 2,
          "runeId": 5051
        },
        {
          "count": 4,
          "runeId": 5071
        },
        {
          "count": 2,
          "runeId": 5125
        },
        {
          "count": 1,
          "runeId": 5167
        },
        {
          "count": 2,
          "runeId": 5193
        },
        {
          "count": 1,
          "runeId": 5215
        },
        {
          "count": 1,
          "runeId": 5247
        },
        {
          "count": 1,
          "runeId": 5337
        }
      ],
      "masteries": [
        {
          "rank": 4,
          "masteryId": 4112
        },
        {
          "rank": 1,
          "masteryId": 4114
        },
        {
          "rank": 3,
          "masteryId": 4122
        },
        {
          "rank": 1,
          "masteryId": 4124
        },
        {
          "rank": 1,
          "masteryId": 4132
        },
        {
          "rank": 3,
          "masteryId": 4134
        },
        {
          "rank": 2,
          "masteryId": 4142
        },
        {
          "rank": 1,
          "masteryId": 4144
        },
        {
          "rank": 1,
          "masteryId": 4151
        },
        {
          "rank": 3,
          "masteryId": 4152
        },
        {
          "rank": 1,
          "masteryId": 4154
        },
        {
          "rank": 1,
          "masteryId": 4162
        }
      ]
    },
    {
      "teamId": 100,
      "spell1Id": 7,
      "spell2Id": 4,
      "championId": 82,
      "profileIconId": 20,
      "summonerName": "ThrobJohnson",
      "bot": false,
      "summonerId": 65369656,
      "runes": [],
      "masteries": [
        {
          "rank": 2,
          "masteryId": 4212
        },
        {
          "rank": 2,
          "masteryId": 4213
        },
        {
          "rank": 2,
          "masteryId": 4214
        },
        {
          "rank": 3,
          "masteryId": 4222
        },
        {
          "rank": 1,
          "masteryId": 4224
        },
        {
          "rank": 1,
          "masteryId": 4232
        },
        {
          "rank": 1,
          "masteryId": 4233
        }
      ]
    },
    {
      "teamId": 100,
      "spell1Id": 7,
      "spell2Id": 4,
      "championId": 34,
      "profileIconId": 778,
      "summonerName": "VikingPrincess",
      "bot": false,
      "summonerId": 30101782,
      "runes": [
        {
          "count": 2,
          "runeId": 5196
        },
        {
          "count": 1,
          "runeId": 5200
        },
        {
          "count": 1,
          "runeId": 5245
        },
        {
          "count": 4,
          "runeId": 5257
        },
        {
          "count": 4,
          "runeId": 5268
        },
        {
          "count": 5,
          "runeId": 5290
        },
        {
          "count": 4,
          "runeId": 5297
        },
        {
          "count": 6,
          "runeId": 5317
        },
        {
          "count": 1,
          "runeId": 5357
        },
        {
          "count": 2,
          "runeId": 5367
        }
      ],
      "masteries": [
        {
          "rank": 4,
          "masteryId": 4112
        },
        {
          "rank": 4,
          "masteryId": 4113
        },
        {
          "rank": 3,
          "masteryId": 4123
        },
        {
          "rank": 1,
          "masteryId": 4133
        },
        {
          "rank": 2,
          "masteryId": 4143
        },
        {
          "rank": 2,
          "masteryId": 4211
        },
        {
          "rank": 2,
          "masteryId": 4212
        },
        {
          "rank": 2,
          "masteryId": 4213
        },
        {
          "rank": 3,
          "masteryId": 4222
        },
        {
          "rank": 1,
          "masteryId": 4232
        },
        {
          "rank": 3,
          "masteryId": 4234
        },
        {
          "rank": 3,
          "masteryId": 4241
        }
      ]
    },
    {
      "teamId": 200,
      "spell1Id": 6,
      "spell2Id": 7,
      "championId": 432,
      "profileIconId": 4,
      "summonerName": "Jonesiee",
      "bot": false,
      "summonerId": 61285753,
      "runes": [],
      "masteries": [
        {
          "rank": 2,
          "masteryId": 4112
        },
        {
          "rank": 2,
          "masteryId": 4113
        },
        {
          "rank": 2,
          "masteryId": 4211
        }
      ]
    },
    {
      "teamId": 200,
      "spell1Id": 14,
      "spell2Id": 4,
      "championId": 13,
      "profileIconId": 25,
      "summonerName": "Silentwolf3794",
      "bot": false,
      "summonerId": 38328038,
      "runes": [
        {
          "count": 6,
          "runeId": 5123
        },
        {
          "count": 6,
          "runeId": 5167
        },
        {
          "count": 6,
          "runeId": 5195
        },
        {
          "count": 2,
          "runeId": 5215
        }
      ],
      "masteries": [
        {
          "rank": 1,
          "masteryId": 4111
        },
        {
          "rank": 2,
          "masteryId": 4112
        },
        {
          "rank": 1,
          "masteryId": 4114
        },
        {
          "rank": 3,
          "masteryId": 4122
        },
        {
          "rank": 1,
          "masteryId": 4124
        },
        {
          "rank": 1,
          "masteryId": 4132
        },
        {
          "rank": 3,
          "masteryId": 4134
        },
        {
          "rank": 3,
          "masteryId": 4142
        },
        {
          "rank": 1,
          "masteryId": 4144
        },
        {
          "rank": 1,
          "masteryId": 4151
        },
        {
          "rank": 3,
          "masteryId": 4152
        }
      ]
    },
    {
      "teamId": 200,
      "spell1Id": 13,
      "spell2Id": 21,
      "championId": 15,
      "profileIconId": 688,
      "summonerName": "SheIsShy",
      "bot": false,
      "summonerId": 51470097,
      "runes": [
        {
          "count": 9,
          "runeId": 5273
        },
        {
          "count": 9,
          "runeId": 5297
        },
        {
          "count": 9,
          "runeId": 5317
        },
        {
          "count": 3,
          "runeId": 5357
        }
      ],
      "masteries": [
        {
          "rank": 3,
          "masteryId": 4113
        },
        {
          "rank": 1,
          "masteryId": 4114
        },
        {
          "rank": 3,
          "masteryId": 4123
        },
        {
          "rank": 1,
          "masteryId": 4124
        },
        {
          "rank": 1,
          "masteryId": 4133
        },
        {
          "rank": 3,
          "masteryId": 4134
        },
        {
          "rank": 3,
          "masteryId": 4143
        },
        {
          "rank": 1,
          "masteryId": 4144
        },
        {
          "rank": 3,
          "masteryId": 4152
        },
        {
          "rank": 1,
          "masteryId": 4154
        },
        {
          "rank": 1,
          "masteryId": 4162
        },
        {
          "rank": 2,
          "masteryId": 4211
        },
        {
          "rank": 2,
          "masteryId": 4212
        },
        {
          "rank": 1,
          "masteryId": 4221
        },
        {
          "rank": 3,
          "masteryId": 4222
        },
        {
          "rank": 1,
          "masteryId": 4232
        }
      ]
    },
    {
      "teamId": 200,
      "spell1Id": 21,
      "spell2Id": 7,
      "championId": 14,
      "profileIconId": 657,
      "summonerName": "Reecedude21",
      "bot": false,
      "summonerId": 25376276,
      "runes": [
        {
          "count": 5,
          "runeId": 5245
        },
        {
          "count": 4,
          "runeId": 5253
        },
        {
          "count": 7,
          "runeId": 5289
        },
        {
          "count": 2,
          "runeId": 5290
        },
        {
          "count": 9,
          "runeId": 5317
        },
        {
          "count": 3,
          "runeId": 5335
        }
      ],
      "masteries": [
        {
          "rank": 1,
          "masteryId": 4111
        },
        {
          "rank": 4,
          "masteryId": 4113
        },
        {
          "rank": 3,
          "masteryId": 4122
        },
        {
          "rank": 1,
          "masteryId": 4131
        },
        {
          "rank": 1,
          "masteryId": 4132
        },
        {
          "rank": 3,
          "masteryId": 4134
        },
        {
          "rank": 1,
          "masteryId": 4141
        },
        {
          "rank": 3,
          "masteryId": 4142
        },
        {
          "rank": 3,
          "masteryId": 4152
        },
        {
          "rank": 1,
          "masteryId": 4162
        },
        {
          "rank": 2,
          "masteryId": 4211
        },
        {
          "rank": 2,
          "masteryId": 4212
        },
        {
          "rank": 1,
          "masteryId": 4221
        },
        {
          "rank": 3,
          "masteryId": 4222
        },
        {
          "rank": 1,
          "masteryId": 4232
        }
      ]
    },
    {
      "teamId": 200,
      "spell1Id": 4,
      "spell2Id": 3,
      "championId": 11,
      "profileIconId": 10,
      "summonerName": "jgable",
      "bot": false,
      "summonerId": 57414867,
      "runes": [
        {
          "count": 8,
          "runeId": 5247
        },
        {
          "count": 7,
          "runeId": 5297
        },
        {
          "count": 8,
          "runeId": 5317
        },
        {
          "count": 1,
          "runeId": 5337
        },
        {
          "count": 1,
          "runeId": 5365
        }
      ],
      "masteries": [
        {
          "rank": 4,
          "masteryId": 4113
        },
        {
          "rank": 1,
          "masteryId": 4114
        },
        {
          "rank": 1,
          "masteryId": 4121
        },
        {
          "rank": 3,
          "masteryId": 4123
        },
        {
          "rank": 1,
          "masteryId": 4131
        },
        {
          "rank": 1,
          "masteryId": 4133
        },
        {
          "rank": 3,
          "masteryId": 4134
        },
        {
          "rank": 1,
          "masteryId": 4141
        },
        {
          "rank": 1,
          "masteryId": 4144
        },
        {
          "rank": 3,
          "masteryId": 4152
        },
        {
          "rank": 1,
          "masteryId": 4154
        },
        {
          "rank": 1,
          "masteryId": 4162
        },
        {
          "rank": 2,
          "masteryId": 4313
        }
      ]
    }
  ],
  "observers": {
    "encryptionKey": "MkpN9vtXois4iwLEgATn2sX0SCqFrw3R"
  },
  "platformId": "NA1",
  "bannedChampions": [],
  "gameStartTime": 0,
  "gameLength": 0
};