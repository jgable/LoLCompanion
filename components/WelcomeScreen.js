var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

var dispatcher = require('dispatcher');

var SummonersStore = require('../stores/summoners');

var WelcomeScreen = React.createClass({
  displayName: 'WelcomeScreen',

  getInitialState: function () {
    return {
      summoner: '',
      loading: false,
      found: null
    };
  },

  componentDidMount: function () {
    SummonersStore.on('summoner:load:complete', this.handleLoadComplete, this);
    SummonersStore.on('summoner:load:error', this.handleLoadError, this);
  },

  componentDidUnmount: function () {
    SummonersStore.off(null, null, this);
  },

  render: function () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to LoLCompanion!
        </Text>
        <Text style={styles.instructions}>
          Enter the name of your summoner to continue
        </Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          editable={!this.state.loading}
          onSubmitEditing={this.onNameSubmit}
          onChangeText={(text) => this.setState({summoner: text})}
          placeholder="Summoner name..."
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
          />
        {this._renderFound()}
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={styles.spinner}
          />
      </View>
    );
  },

  _renderFound: function () {
    var found = this.state.found;
    if (!found) {
      return null;
    }

    return (
      <Text style={styles.instructions}>
        {[found.name, found.id].join(' ')}
      </Text>
    );
  },

  onNameSubmit: function () {
    console.log('name submit', this.state.summoner);
    this.setState({
      loading: true
    });

    dispatcher.dispatch('summoner:load', this.state.summoner);
  },

  handleLoadComplete: function () {
    var found = SummonersStore.getByName(this.state.summoner);
    console.log('load:complete', found);

    this.setState({
      loading: false,
      found: found,
    });
  },

  handleLoadError: function () {
    this.setState({
      loading: false,
      error: 'There was a problem finding that summoner',
    });
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10
  },
  searchBar: {
    marginTop: 64,
    padding: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarInput: {
    fontSize: 15,
    height: 30,
    alignSelf: 'center',
    textAlign: 'center',
    margin: 20,
    width: 100
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  spinner: {
    width: 30,
  },
});

module.exports = WelcomeScreen;
