var app = require('application');
var common = require('./sound-common');

var MediaSession = android.media.session.MediaSession;
var MediaController = android.media.session.MediaController;

var MyMediaSessionCallback = MediaSession.Callback.extend({
  onMediaButtonEvent: function(arg) {
    console.log('onMediaButtonEvent', arg);
  },
  onPlay: function() {
    console.log('onPlay');
  },
  onPause: function() {
    console.log('onPause');
  },
  onStop: function() {
    console.log('onPause');
  }
});


var Sound = (function (_super) {
    __extends(Sound, _super);
    function Sound() {
        _super.apply(this, arguments);
        console.log('context', app.android.context);
        console.log('ms-flag', MediaSession.FLAG_HANDLES_TRANSPORT_CONTROLS);
        this._session = new MediaSession(app.android.context, 'tns-mediaplayer');
        this._session.setFlags(MediaSession.FLAG_HANDLES_MEDIA_BUTTONS | MediaSession.FLAG_HANDLES_TRANSPORT_CONTROLS);
        this._session.setCallback(new MyMediaSessionCallback);
        this._session.setActive(true);
        this._player = android.media.MediaPlayer.create(app.android.context, android.net.Uri.parse(this._path));
        
        // console.dump(app.android.context);
    }
    Sound.prototype.play = function () {
        this._player.start();
    };
    Sound.prototype.pause = function () {
        this._player.pause();
    };
    Sound.prototype.stop = function () {
        this._player.stop();
    };
    Sound.prototype.isPlaying = function () {
        this._player.isPlaying();
    };
    Sound.prototype.seekTo = function (milis) {
        this._player.seekTo(milis);
    };
    Sound.prototype.release = function () {
        this._player.release();
        this._player = null;
    };
    Sound.prototype.getDuration = function() {
        return this._player.getDuration();
    };
    Sound.prototype.getCurrentPosition = function() {
        return this._player.getCurrentPosition();
    };
    Sound.prototype.setRate = function(rate) {
        console.warn('Cannot set Sound.rate on Android.');
        return false;
    };
    Sound.prototype.getRate = function() {
        return 1;
    };
    
    return Sound;
})(common.Sound);
exports.Sound = Sound;

exports.create = function(path) {
    return new Sound(path);
};