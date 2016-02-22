var common = require("./sound-common");

var Sound = (function (_super) {
    __extends(Sound, _super);
    function Sound() {
        _super.apply(this, arguments);

        this._url = NSURL.fileURLWithPath(this._path);
        this._player = new AVAudioPlayer();
        this._player.initWithContentsOfURLError(this._url);
        this._player.enableRate = true;
        this._player.prepareToPlay();
    }
    Sound.prototype.play = function () {
        this._player.play();
    };
    Sound.prototype.pause = function () {
        this._player.pause();
    };
    Sound.prototype.stop = function () {
        this._player.stop();
    };
    Sound.prototype.isPlaying = function () {
        this._player.playing;
    };
    Sound.prototype.seekTo = function (milis) {
        this._player.currentTime = milis / 1000;
    };
    Sound.prototype.release = function () {
        this._player.release();
        this._player = null;
    };
    Sound.prototype.getDuration = function() {
        return this._player.duration * 1000;
    };
    Sound.prototype.getCurrentPosition = function() {
        return this._player.currentTime * 1000;
    };
    Sound.prototype.setRate = function(rate) {
        console.assert(0.5 <= rate && rate <= 2);
        console.log('iOS: Set rate to '+ rate)
        this._player.rate = rate;
        return true;
    };
    Sound.prototype.getRate = function() {
        return this._player.rate;
    }
    return Sound;
})(common.Sound);
exports.Sound = Sound;

exports.create = function(path) {
    return new Sound(path);
};
