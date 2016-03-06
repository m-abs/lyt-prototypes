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

// import AudioView from './src/audioplayer';
import LibraryView from './src/library';

AppRegistry.registerComponent('ReactNativeProto2', () => LibraryView);
