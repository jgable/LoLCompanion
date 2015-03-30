var React = require('react-native');
var _ = require('lodash');
var Button = require('react-native-button');
var {
  Image,
  StyleSheet,
  Text,
  View,
} = React;

var Summoner = React.createClass({
  displayName: 'Summoner',

  propTypes: {
    summoner: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <View ref="container" style={styles.container}>
          <Image
            style={styles.profileImage}
            source={{uri: this.getSummonerIconUrl()}}
            />
        <View style={styles.profileContent}>
          <Text style={styles.profileName}>{this.props.summoner.name}</Text>
          <Text style={styles.profileLevel}>Level: {this.props.summoner.summonerLevel}</Text>
        </View>
      </View>
    );
  },

  getSummonerIconUrl: function () {
    var profileIconId = this.props.summoner.profileIconId;
    
    // TODO: Move this to a central place that can be updated easier;
    // more info about static data: https://developer.riotgames.com/docs/static-data
    return `http://ddragon.leagueoflegends.com/cdn/5.6.1/img/profileicon/${profileIconId}.png`;
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 128,
  },
  profileImage: {
    width: 128,
    height: 128,
  },
  profileContent: {
    width: 200,
    padding: 10
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  profileLevel: {
    fontSize: 14
  }
});

module.exports = Summoner;
