
//  NOTE: packager does not discover .jxs files in 0.20+

'use strict';

import React, {
  AppRegistry,
  Platform,
  Component,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  Animated,
  Alert,
  Navigator,
  TouchableOpacity,
  WebView,
  Dimensions,
} from 'react-native';

//var ProgressBar = require('ProgressBarAndroid');

// https://github.com/jeanregisser/react-native-slider
import Slider from 'react-native-slider';

// https://github.com/zmxv/react-native-sound
import Sound from 'react-native-sound';

// https://github.com/lucasferreira/react-native-webview-android
//import WebViewAndroid from 'react-native-webview-android';

// https://github.com/oblador/react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

class AudioView extends Component {
  mixins: [TimerMixin];
  mySound: React.PropTypes.any;
  
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
    }
  }
  
  componentWillMount() {
    this.setState({
      isSeeking: false,
      secondsPlayed: 0,
      duration: 0,
      progress: 0,
      value: 0.25,
    });
  }
  
  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
    this.stopSound();
  }
  
  tick() {
    console.log('beep');
    if (this.mySound && !this.state.isSeeking) {
      this.mySound.getCurrentTime((curTimeSec) => {
        this.setState({
          secondsPlayed: Math.round(curTimeSec * 100) / 100,
          progress: curTimeSec / this.state.duration
        });
      });
    }
  }
  
  playSound() {
    this.mySound = new Sound('thunder.mp3', Sound.MAIN_BUNDLE, (error, obj) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else { // loaded successfully
        console.log('mySound', this.mySound);
        console.log('duration in seconds: ' + this.mySound.getDuration());
        
        this.setState({ duration: Math.round(this.mySound.getDuration()) });
        
        Animated.spring(          // Uses easing functions
          this.state.fadeAnim,    // The value to drive
          {toValue: 1},           // Configuration
        ).start();
        
        //Play the sound with an onEnd callback
        this.mySound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
          this.stopSound();
        });
      }
    });
  }
  seekForward() {
    if (this.mySound) {
      this.mySound.getCurrentTime((curTimeSec) => {
        this.seekTo(curTimeSec + 5);
      });
    }
  }
  seekTo(seconds) {
    if (this.mySound) this.mySound.setCurrentTime(seconds);
  }
  stopSound() {
    if (this.mySound) {
      this.mySound.stop();
      this.mySound.release();
      this.mySound = null;
      this.setState({progress: 0, secondsPlayed: 0});
      
      Animated.spring(          // Uses easing functions
        this.state.fadeAnim,    // The value to drive
        {toValue: 0},           // Configuration
      ).start();
    }
    console.log('refs', this.refs.webview.getWebViewHandle());
    this.refs.webview.url = `./www/static.html#dol_1_15_zujc_1000`;
    this.refs.webview.reload();
  }
  
  onSlidingStart() {
    if (this.mySound) {
      this.setState({'isSeeking': true});
    }
  }
  
  onSlidingComplete(value) {
    if (this.mySound) {
      console.log('slide-complete', value);
      let seekTimeSec = this.mySound.getDuration() * value;
      this.seekTo(seekTimeSec);
      this.setState({'isSeeking': false, 'progress': value});
    }
  }
  
  render() {
    // console.log('this::render', this);
    return (
      <View style={styles.topContainer}>
        <View style={styles.container}>
          <View style={[styles.reactAd], {}}>
            <Image source={{uri: 'http://i.imgur.com/1m1kt27.png'}} style={styles.image} />
            <Text style={styles.subtitle}>~React Native~</Text>
          </View>
          <Text style={styles.welcome}>LYT3 AudioPlayer Prototype</Text>
          
          <View style={styles.audioControlRow}>
            <TouchableOpacity onPress={this.playSound.bind(this)} style={styles.audioControl}>
              <Icon name="play" size={44} color="#007aff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.seekForward.bind(this)} style={styles.audioControl}>
              <Icon name="forward" size={44} color="#007aff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.stopSound.bind(this)} style={styles.audioControl}>
              <Icon name="stop" size={44} color="#007aff" />
            </TouchableOpacity>
          </View>
          
          { this.mySound ? this._renderAudioControls() : null }
        </View>
        
        <View style={styles.webview}>
          <WebView
            ref={'webview'}
            source={require('./www/static.html')}
            javascriptEnabled={true}
            injectedJavascript={`smoothScroll.init();`}
            renderError={(err) => console.log('renderErr', err)}
            renderLoading={(arg) => console.log('renderLoad', arg)} 
            onError={(err) => console.log('err', err)}
            onLoad={(arg) => console.log('onLoad', arg)}
            onLoadStart={(arg) => console.log('onLoadStart', arg)}
            onNavigationStateChange={(arg) => console.log('onNavStateChange', arg)}
            onShouldStartLoadWithRequest={(arg) => true }
            scalesPageToFit={true}>
          </WebView>
        </View>
      </View>
    );
  }
  
  _renderAudioControls() {
    return (
      <Animated.View style={{opacity: this.state.fadeAnim}}>
        <Slider
          style={styles.slider}
          value={this.state.progress}
          onSlidingStart={this.onSlidingStart.bind(this)}
          onSlidingComplete={this.onSlidingComplete.bind(this)}
          trackStyle={sliderStyle.track}
          thumbStyle={sliderStyle.thumb}
          minimumTrackTintColor='#007aff'
          maximumTrackTintColor='#b7b7b7' />  
        <Text style={styles.instructions}>
          Seconds played: {this.state.secondsPlayed}s / {this.state.duration}s
        </Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: 'white'
    //backgroundColor: '#F5FCFF',
  },
  container: {
    margin: 10,
    alignItems: 'stretch',
  },
  audioControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 4,
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
    elevation: 5,
  },
  image: {
    alignSelf: 'center',
    width: 60,
    height: 60,
  },
  slider: {
  },
  audioControl: {
    marginHorizontal: 10,
  },
  webview: {
    flex: 1,
    borderTopWidth: 1,//StyleSheet.hairlineWidth,
    borderColor: '#007aff',
    backgroundColor: 'rgba(255,255,255,0.8)',
    opacity: 1
  }
});

const sliderStyle = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    borderColor: '#007aff',
    borderWidth: 2,
    //shadow* for iOS only, elevation for android
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
    elevation: 4,
  }
});

module.exports = AudioView