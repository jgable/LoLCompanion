var React = require('react-native');
var _ = require('lodash');
var Button = require('react-native-button');
var {
  ActivityIndicatorIOS,
  AlertIOS,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

var dispatcher = require('../core/dispatcher');

var SummonersStore = require('../stores/summoners');
var Summoner = require('./Summoner');

var GameStore = require('../stores/games');

var CurrentGameScreen = require('./CurrentGameScreen');

var ChooseScreen = React.createClass({
  displayName: 'ChooseScreen',

  propTypes: {
    summonerId: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    return {
      summoner: SummonersStore.getSingle(this.props.summonerId)
    };
  },

  componentDidMount: function () {
    GameStore.on('games:load:current:complete', function (game) {
      this.props.navigator.push({
        title: 'Current Game',
        component: CurrentGameScreen,
        passProps: {
          summonerId: this.state.summonerId,
          gameId: game.id
        }
      });
    }, this);

    GameStore.on('games:load:current:error', function (err, resp) {
      if (resp.status === 404) {
        AlertIOS.alert('Not Found', 'Looks like you are not in a game yet');
      } else {
        AlertIOS.alert('Sorry', 'There was a problem loading the current game');
      }
    }, this);
  },

  componentWillUnmount: function () {
    GameStore.off(null, null, this);
  },

  render: function () {
    return (
      <View style={styles.container}>
        <Summoner summoner={this.state.summoner} />
        <Button style={styles.currentGameButton} onPress={this.goToCurrentGame}>Current Game</Button>
        <Button onPress={this.goToPastGames}>Past Games</Button>
      </View>
    );
  },

  goToCurrentGame: function () {
    dispatcher.dispatch('games:load:current', this.props.summonerId);
  },

  goToPastGames: _.noop
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 80,
    alignItems: 'center'
  },
  currentGameButton: {
    marginTop: 20
  }
});

module.exports = ChooseScreen;
