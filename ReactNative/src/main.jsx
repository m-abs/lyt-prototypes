/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Platform,
  Component,
  StyleSheet,
  Text,
  View,
  Alert,
  Navigator,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  BackAndroid
} from 'react-native';

var Sound = require('react-native-sound');
var cssVar = require('cssVar');

var TouchableElement = TouchableHighlight;
if (Platform.OS === 'android') {
  TouchableElement = TouchableNativeFeedback;
}

class Screen1 extends Component {
  
  playSound() {
    console.log('this', this);
    let mySound;
    mySound = new Sound('thunder.mp3', Sound.MAIN_BUNDLE, (error, obj) => {
      console.log('result', mySound);
      if (error) {
        console.log('failed to load the sound', error);
      } else { // loaded successfully
        console.log('duration in seconds: ' + mySound.getDuration());
        console.log('number of channels: ' + mySound.getNumberOfChannels());
        console.log('volume: ' + mySound.getVolume());
        console.log('pan: ' + mySound.getPan());
        console.log('loops: ' + mySound.getNumberOfLoops());
        
        //Play the sound with an onEnd callback
        mySound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Screen 1
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Shake or press menu button for dev menu
        </Text>
        <TouchableHighlight onPress={this.playSound.bind(this)}>
          <Text style={styles.button}>
            Start the Thunderrrr!
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

class Screen2 extends Component {
  _onPressButton() {
    console.log('button clicked');
    console.log('props', this.props);
    //Alert.alert('Click event!', 'Button clicked...');
    this.props.onForward();
    //this.props.navigator.push({ 'name': 'Depth '+ this.props.route.index });
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  backgroundColor = this.getRandomColor();
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.backgroundColor}}>
        <Text style={styles.welcome}>
          Welcome to Screen 2
        </Text>
        <Text style={styles.welcome}>
          {this.props.route.name}
        </Text>
        <TouchableHighlight onPress={this.props.onForward}>
          <Text style={styles.button}>
            Push Stack
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.onBack}>
          <Text style={styles.button}>
            Pop to Top
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

class MainView extends Component {
  
  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackButtonPress.bind(this));
  }
  
  _handleBackButtonPress() {
    if (this.nav && this.nav.state.presentedIndex > 0) {
      // console.log(this.nav);
      this.nav.pop();
      return true;
    }
    return false;
  }
  
  _renderScene(route, navigator) {
    // console.log('route', route);
    // console.log('nav', navigator);
    if (route.index % 2 == 0) {
    return (
      <Screen1 navigator={navigator} route={route} />
    );
    } else {
    return (
      <Screen2 navigator={navigator} route={route}
        onForward={() => {
          var nextIndex = route.index + 1;
          navigator.push({
            title: 'SubScene',
            index: nextIndex,
          });
        }}
        onBack={() => {
          if (route.index > 0) {
            navigator.popToTop();
          }
        }}
      />
    );
    }
  }
  
  render() {
    return (
      <Navigator
        initialRoute={{title: 'My First Scene', index: 0}}
        configureScene={() => Navigator.SceneConfigs.PushFromRight}
        renderScene={this._renderScene}
        ref={(nav) => { this.nav = nav; }}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}/>
        }
      />
    );
  }
}

var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Back
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    let newIdx = index + 1;
    return (
      <TouchableOpacity
        onPress={() => navigator.push({'title': 'SubScene', 'index': newIdx})}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Next
        </Text>
      </TouchableOpacity>
    );
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title} [{index}]
      </Text>
    );
  },

};

class MyNavBar extends Component {
  render() {
    return (
      <View style={styles.navbar}>
        <Text style={styles.backButton}>Back</Text>
        <View style={styles.separator} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    margin: 10,
    color: '#007aff',
    fontFamily: '.HelveticaNeueInterface-MediumP4',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 24,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: cssVar('fbui-bluegray-60'),
    fontWeight: '500',
    marginVertical: 10,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: cssVar('fbui-accent-blue'),
  }
});

module.exports = MainView;