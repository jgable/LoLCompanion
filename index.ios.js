/**
 * LoLCompanion React Native App
 * https://github.com/facebook/react-native
 * @providesModule LoLCompanion
 */
'use strict';
var React = require('react-native');

// This overrides the Backbone.sync method as a side effect
/* jshint ignore: start */
var sideEffects = require('backbone-sync-fetch');
/* jshint ignore: end */

var _ = require('lodash');
var dispatcher = require('dispatcher');
var Store = require('store');

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
} = React;

var WelcomeScreen = require('./components/WelcomeScreen');

var LoLCompanion = React.createClass({

  getInitialState: function () {
    return {
      username: null
    };
  },

  componentDidMount: function () {
    // TODO: Load last username from storage
  },
  
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Welcome',
          component: WelcomeScreen,
        }}/>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('LoLCompanion', () => LoLCompanion);
