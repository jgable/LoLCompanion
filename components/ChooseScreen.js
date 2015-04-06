var React = require('react-native');
var _ = require('lodash');
var Button = require('react-native-button');
var {
  ActivityIndicatorIOS,
  AlertIOS,
  Image,
  ScrollView,
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

var CurrentGameDetails = React.createClass({
  displayName: 'CurrentGameDetails',

  getInitialState: function () {
    var game = GameStore.getSingle(this.props.currentGameId);
    var me = _.findWhere(game.participants, { summonerId: this.props.summoner.id });
    var myTeam = game.participants.filter((p) => p.teamId === me.teamId && p !== me);
    var otherTeam = game.participants.filter((p) => p.teamId !== me.teamId);
    
    return { game, me, myTeam, otherTeam };
  },

  render: function () {
    return (
      <View>
        {this.renderEnemyTeam()}
      </View>
    );
  },

  renderEnemyTeam: function () {
    var players = this.state.otherTeam.map((p) => 
      <View style={styles.teamSummoner}>
        <Summoner summoner={SummonersStore.getSingle(p.summonerId)} />
      </View>
    );
    
    return (
      <View style={styles.teamContainer}>
        <Text style={styles.teamHeading}>Enemy Team</Text>
        {players}
      </View>
    );
  },

  renderMyTeam: function () {
    var players = this.state.myTeam.map((p) => 
      <View style={styles.teamSummoner}>
        <Summoner summoner={SummonersStore.getSingle(p.summonerId)} />
      </View>
    );
    
    return (
      <View style={styles.teamContainer}>
        <Text>My Team</Text>
        {players}
      </View>
    );
  }
});

var ChooseScreen = React.createClass({
  displayName: 'ChooseScreen',

  propTypes: {
    summonerId: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    return {
      summoner: SummonersStore.getSingle(this.props.summonerId),
      loaded: false,
      currentGameId: false
    };
  },

  componentDidMount: function () {
    GameStore.on('games:current:changed', function (currentGameId) {
      this.setState({
        loaded: true,
        currentGameId: currentGameId
      });
    }, this);

    GameStore.pollForCurrentGame(this.state.summoner.id);
  },

  componentWillUnmount: function () {
    GameStore.stopPollingCurrentGame();
    GameStore.off(null, null, this);
  },

  render: function () {
    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
        <Summoner summoner={this.state.summoner} />
        {this.renderCurrentGame()}
      </ScrollView>
    );
  },

  renderCurrentGame: function () {
    if (!this.state.loaded) {
      return <Text style={styles.disabledButton}>Checking for current game...</Text>;
    }
    
    if (!this.state.currentGameId) {
      return <Text style={styles.disabledButton}>No Current Game</Text>;
    }

    return (
      <CurrentGameDetails {...this.state} />
    );
  },

  goToCurrentGame: function () {
    if (!this.state.currentGameId) {
      return;
    }
    
    this.props.navigator.push({
      title: 'Current Game',
      component: CurrentGameScreen,
      passProps: {
        summonerId: this.state.summonerId,
        gameId: this.state.currentGameId
      }
    });
  }
});

var styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  currentGameButton: {
    marginTop: 20
  },
  disabledButton: {
    marginTop: 20,
    opacity: 0.8,
    color: 'gray'
  },
  teamContainer: {
    marginTop: 20,
  },
  teamHeading: {
    fontWeight: 'bold'
  },
  teamSummoner: {
    marginTop: 20
  }
});

module.exports = ChooseScreen;
