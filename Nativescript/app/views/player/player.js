var frameModule = require('ui/frame');
var viewModule = require('ui/core/view');
var Color = require('color').Color;
var dialogsModule = require('ui/dialogs');
var sliderModule = require("ui/slider");
var webViewModule = require("ui/web-view");
var Observable = require("data/observable").Observable;
var timer = require("timer");

var Sound = require('../../sound/sound');

var page, slider, webView, playerModel;
var mySound, isSeeking = false, bookProgressId = 1000, intervalId, intervalCount = 0;

// http://stackoverflow.com/questions/9390298/iphone-how-to-detect-the-end-of-slider-drag

exports.pageLoaded = function(args) {
    console.log('pageLoaded');
    page = args.object;
    webView = page.getViewById('my-webview');
    
    webView.on(webViewModule.WebView.loadStartedEvent, function (args) {
        console.log('WebView:', (args.error ? 'Error loading ' : 'Loading ') + args.url);
    });
    webView.on(webViewModule.WebView.loadFinishedEvent, function (args) {
        console.log('WebView:', (args.error ? 'Error loading ' : 'Finished loading ') + args.url);
    });
    // webView.src = '<!DOCTYPE html><html><head><title>MyTitle</title><meta charset="utf-8" /></head><body><span style="color:red">Hello WÖRLD</span></body></html>';
    
    slider = page.getViewById('my-slider');
    slider.on('touch', function (args) {
        if (!mySound) return;
        // console.dump(arguments);
        console.log('slider:touch:' + args.action);
        if (args.action === 'down') isSeeking = true;
        else if (args.action === 'up') {
            exports.seekToPercent(slider.value);
            isSeeking = false;
        }
    });
    
    if (intervalId) timer.clearInterval(intervalId);
    intervalId = timer.setInterval(function () {
        if (mySound) {
            playerModel.playedText = 'Played '+ mySound.getCurrentPosition() / 1000 + "s of "+ playerModel.duration / 1000 +"s";
            if (!isSeeking) {
                var progressPercent = getProgress() * 100.0;
                console.log('progress', progressPercent);
                playerModel.progress = progressPercent;
            }
            if (intervalCount % 5 == 0) {
                var nextElemId = 'dol_1_15_zujc_'+ bookProgressId++;
                console.log('WebView.smoothScroll: #' + nextElemId);
                webView.url = `javascript:smoothScroll.animateScroll('#${nextElemId}');`;
            }
            ++intervalCount;
        }
    }, 1000);
    
    playerModel = new Observable({'progress': 15, 'duration' : 0, 'playedText': ''});
    page.bindingContext = playerModel;
};

function getProgress() {
    return mySound.getCurrentPosition() / mySound.getDuration();
} 

exports.playPause = function(args) {
    console.log('playPause', args);
    if (mySound) exports.stop();
    mySound = Sound.create('~/mp3/thunder.mp3');
    mySound.play();
    playerModel.duration = mySound.getDuration();
    console.log('duration', exports.getDuration());
};

exports.seekToPercent = function(percent) {
    if (mySound) {
        var seekToMilis = percent / 100 * mySound.getDuration();
        mySound.seekTo(seekToMilis);
    }
}

exports.seekForward = function() {
    if (mySound) {
        var seekToMilis = mySound.getCurrentPosition() + 5000;
        mySound.seekTo(seekToMilis);
    }
}

exports.stop = function(args) {
    if (mySound) {
        mySound.stop();
        mySound.release();
        mySound = null;
        playerModel.set('progress', 0);
    }
}

exports.toggleRate = function() {
    if (mySound) {
        if (mySound.rate != 1) {
            if (mySound.setRate(2)) {
                page.getViewById('rate-btn').style.backgroundColor = new Color('Green');
            }
        } else {
            mySound.setRate(1);
        }
    }
}

exports.getDuration = function() {
    return mySound.getDuration();
}