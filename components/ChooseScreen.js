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

  render: function () {
    return (
      <View style={styles.container}>
        <Summoner summoner={this.state.summoner} />
        <Button style={styles.currentGameButton} onPress={this.goToCurrentGame}>Current Game</Button>
        <Button onPress={this.goToPastGames}>Past Games</Button>
      </View>
    );
  },

  goToCurrentGame: _.noop,

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
