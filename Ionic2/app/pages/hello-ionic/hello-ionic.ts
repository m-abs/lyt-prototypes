'use strict';

import {Page, Platform} from 'ionic-framework/ionic';

@Page({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html'
})
export class HelloIonicPage {
  platform: Platform;
  media: Media;
  isPlaying: boolean = false;
  playPauseIcon: string = 'play';
  currentPosition: number = 0;
  duration: number = 0;

  constructor(platform: Platform) {
    this.platform = platform;
    
    setInterval(() => {
      if (this.media) {
        this.media.getCurrentPosition((position) => {
          if (position > -1) {
              this.currentPosition = Math.round(position * 100) / 100;
              this.duration = Math.round(this.media.getDuration() * 100) / 100;
              console.log(`Played to ${this.currentPosition} of ${this.duration} in media.`);
          }
        }, function() { console.log('fail'); });
      }
    }, 1000);
  }

  obtainNetworkConnection() {
    this.platform.ready().then(() => {
      console.log('obtainNetworkConnection :: platform.ready');
        this.networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        alert('Connection type: ' + states[this.networkState]);
    });
  }

  playMedia() {
    this.platform.ready().then(() => {
      if (!this.media) {
        // Plugin Docs: https://github.com/apache/cordova-plugin-media
        // http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3
        //this.media = new Media('http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3', function() { console.log('mediaSuccess') }, function() { console.log('mediaError') }, this.mediaStatusChange);
        this.media = new Media('/android_asset/www/mp3/thunder.mp3',
          () => { console.log('mediaSuccess'); this.playPauseIcon = 'play'; },
          (err) => { console.log('mediaError', err); },
          (status) => { console.log('Status change: '+ status); });
        console.log(this.media.setRate(2));
        console.log('Created Media', this.media);
      }
      if (this.isPlaying) {
        this.media.pause();
        this.playPauseIcon = 'play';
      } else {
        this.media.setRate(2);
        this.media.play();
        this.playPauseIcon = 'pause';
      }
      this.isPlaying = !this.isPlaying;
    });
  }

  stopMedia() {
    if (this.media) {
      this.media.stop();
      this.media.release();
      this.media = null;
      this.isPlaying = false;
      this.playPauseIcon = 'play';
    }
  }

  seekForward() {
    if (this.media) {
      console.log('seek');
      this.media.getCurrentPosition((position) => {
        if (position > -1) {
          console.log((position) + " sec");
          this.media.seekTo((position + 10) * 1000);
        }
      });
    }
  }
}
