var React = require('react-native');
var _ = require('lodash');
var Button = require('react-native-button');
var {
  ActivityIndicatorIOS,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

var dispatcher = require('dispatcher');

var SummonersStore = require('../stores/summoners');
var Summoner = require('./Summoner');

var GameStore = require('../stores/games');

var CurrentGameScreen = React.createClass({
  displayName: 'CurrentGameScreen',

  propTypes: {
    summonerId: React.PropTypes.number.isRequired,
    gameId: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    var game = GameStore.getSingle(this.state.gameId);
    var me = _.findWhere(game.participants, { summonerId: this.state.summonerId });
    
    var participantIds = _.reduce(game.participants, function (result, participant) {
      if (me.team === participant.team) {
        result.us.push(participant.summonerId);
      } else {
        result.them.push(participant.summonerId);
      }

      return result;
    }, {
      us: [],
      them: []
    });
    
    return {
      game: game,
      summoner: SummonersStore.getSingle(this.state.summonerId),
      us: participantIds.us.map((id) => SummonersStore.getSingle(id)),
      them: participantIds.them.map((id) => SummonersStore.getSingle(id)), 
    };
  },

  render: function () {
    return (
      <View style={styles.container}>
        <Text>{this.state.game.id}</Text>
      </View>
    );
  }
});