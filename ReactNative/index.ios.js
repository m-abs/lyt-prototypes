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
  TextInput,
  Image,
  View,
  Animated,
  Alert,
  Navigator,
  TouchableOpacity,
  WebView,
} from 'react-native';

// import MainView from './src/main';
import AudioView from './src/audioplayer';
// import NavigatorExample from './src/NavigatorExample';
// import SliderExample from './src/slider';
// import WebViewExample from './src/webview';

AppRegistry.registerComponent('ReactNativeProto2', () => AudioView);
