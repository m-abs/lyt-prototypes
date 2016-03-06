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


// https://github.com/lucasferreira/react-native-webview-android
//import WebViewAndroid from 'react-native-webview-android';

// https://github.com/oblador/react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://nota.dk';

class LibraryView extends Component {
  mixins: [TimerMixin];

  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      url: DEFAULT_URL,
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
    };
  }

  render() {
    // console.log('this::render', this);
    return (
      <View style={styles.topContainer}>
        <View style={styles.webview}>
          <WebView
            ref={WEBVIEW_REF}
            source={{uri: this.state.url}}
            javascriptEnabled={true}
            domStorageEnabled={true}
            renderError={(err) => console.log('renderErr', err)}
            renderLoading={(arg) => console.log('renderLoad', arg)}
            onError={(err) => console.log('err', err)}
            onLoad={(arg) => console.log('onLoad', arg)}
            onLoadStart={(arg) => console.log('onLoadStart', arg)}
            onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
            onShouldStartLoadWithRequest={(arg) => this.onShouldStartLoadWithRequest(arg)}
            scalesPageToFit={false}
            startInLoadingState={true}
          >
          </WebView>
        </View>
      </View>
    );
  }

  onNavigationStateChange(navState) {
    this.setState({
      backButtonEnabled: !!navState.canGoBack,
      forwardButtonEnabled: !!navState.canGoForward,
      url: navState.url,
      status: navState.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  }

  onShouldStartLoadWithRequest(event) {
    alert('onShouldStartLoadWithRequest', event);
    // Implement any custom loading logic here, don't forget to return!
    return true;
  }

  goBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  goForward() {
    this.refs[WEBVIEW_REF].goForward();
  }

  reload() {
    this.refs[WEBVIEW_REF].reload();
  }
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: 'white'
    //backgroundColor: '#F5FCFF',
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

module.exports = LibraryView;
