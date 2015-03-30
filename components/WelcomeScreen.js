var React = require('react-native');
var Button = require('react-native-button');
var {
  ActivityIndicatorIOS,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

var dispatcher = require('dispatcher');

var SummonersStore = require('../stores/summoners');
var Summoner = require('./Summoner');

var ChooseScreen = require('./ChooseScreen');

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
        <View style={styles.searchBar}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!this.state.loading}
            onSubmitEditing={this.handleNameSubmit}
            onChangeText={(text) => this.setState({summoner: text})}
            placeholder="Summoner name..."
            onFocus={this.props.onFocus}
            style={styles.searchBarInput}
            />
          <Button style={styles.searchBarButton} onPress={this.handleNameSubmit}>Search!</Button>
        </View>
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={styles.spinner}
          />
        <View style={styles.searchResults}>
          {this._renderFound()}
        </View>
      </View>
    );
  },

  _renderFound: function () {
    var found = this.state.found;
    if (this.state.loading || (!found && !this.state.searched)) {
      return null;
    } else if (!found && this.state.error) {
      return <Text style={styles.notFound}>No summoner found with that name</Text>;
    }
    
    return (
      <TouchableHighlight onPress={this.goToChooseScreen} underlayColor="white">
        <Summoner summoner={found} />
      </TouchableHighlight>
    );
  },

  handleNameSubmit: function () {
    console.log('name submit', this.state.summoner);
    this.setState({
      loading: true,
      searched: false,
      found: null
    });

    dispatcher.dispatch('summoner:load', this.state.summoner);
  },

  handleLoadComplete: function () {
    var found = SummonersStore.getByName(this.state.summoner);
    console.log('load:complete', found);

    this.setState({
      loading: false,
      searched: true,
      found: found,
    });
  },

  handleLoadError: function () {
    this.setState({
      loading: false,
      searched: true,
      error: 'There was a problem finding that summoner',
      found: null
    });
  },

  goToChooseScreen: function () {
    var found = this.state.found;

    if (!found) {
      return;
    }

    this.props.navigator.push({
      title: found.name,
      component: ChooseScreen,
      passProps: {
        summonerId: found.id
      }
    });
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 80
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
  notFound: {
    flex: 1,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10
  },
  searchBar: {
    marginHorizontal: 20,
    marginVertical: 10,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarInput: {
    paddingLeft: 10,
    flex: 0.6,
    height: 30,
    fontSize: 15,
  },
  searchBarButton: {
    flex: 0.2,
    marginLeft: 10
  },
  spinner: {
    alignSelf: 'center',
    marginVertical: 10,
    width: 30,
  },
  searchResults: {
    alignItems: 'center'
  }
});

module.exports = WelcomeScreen;
