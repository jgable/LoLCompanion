/**
 * LoLCompanion React Native App
 * https://github.com/facebook/react-native
 * @providesModule LoLCompanion
 */
'use strict';
var React = require('react-native');

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
} = React;

var WelcomeScreen = require('./components/WelcomeScreen');

var LoLCompanion = React.createClass({

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
