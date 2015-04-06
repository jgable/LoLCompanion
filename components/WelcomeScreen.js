var React = require('react-native');
var Button = require('react-native-button');
var {
  ActivityIndicatorIOS,
  AlertIOS,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

var dispatcher = require('../core/dispatcher');

var SummonersStore = require('../stores/summoners');
var Summoner = require('./Summoner');

var ChooseScreen = require('./ChooseScreen');

var WelcomeScreen = React.createClass({
  displayName: 'WelcomeScreen',

  getInitialState: function () {
    return {
      summoner: '',
      loading: false,
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
      </View>
    );
  },

  handleNameSubmit: function () {
    this.setState({
      loading: true,
      found: null
    });

    dispatcher.dispatch('summoner:load', this.state.summoner);
  },

  handleLoadComplete: function () {
    var found = SummonersStore.getByName(this.state.summoner);

    if (!found) {
      AlertIOS.alert('Not Found', 'Unable to find that summoner');
    }

    this.setState({
      loading: false
    });

    this.props.navigator.push({
      title: found.name,
      component: ChooseScreen,
      passProps: {
        summonerId: found.id
      }
    });
  },

  handleLoadError: function (errInfo) {
    var origResponse = errInfo && errInfo.origResponse;

    if (origResponse && origResponse.status === 404) {
      AlertIOS.alert('Not Found', 'Unable to find that summoner');
    } else {
      AlertIOS.alert('Sorry', 'There was an error fetching data.');
    }

    this.setState({
      loading: false
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
