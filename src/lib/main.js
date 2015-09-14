'use strict';

var tabs = require('sdk/tabs');
var self = require('sdk/self');
var worker = null;
const regex = /http(s)?:\/\/(www|tagmanager)\.google\.com(\/tagmanager)?\/*/;
// Unfortunately, add-on sdk doesn't allow ace to load the scripts dynamically.
// Instead, we are forced to load all ace modules here..
const contentScriptFiles = [
    self.data.url('ace/ace.js'),
    self.data.url('ace/worker-css.js'),
    self.data.url('ace/worker-xml.js'),
    self.data.url('ace/worker-javascript.js'),
    self.data.url('ace/worker-html.js'),
    self.data.url('ace/mode-css.js'),
    self.data.url('ace/mode-xml.js'),
    self.data.url('ace/mode-javascript.js'),
    self.data.url('ace/mode-html.js'),
    self.data.url('ace/theme-ambiance.js'),
    self.data.url('ace/theme-chaos.js'),
    self.data.url('ace/theme-chrome.js'),
    self.data.url('ace/theme-clouds.js'),
    self.data.url('ace/theme-clouds_midnight.js'),
    self.data.url('ace/theme-cobalt.js'),
    self.data.url('ace/theme-crimson_editor.js'),
    self.data.url('ace/theme-dawn.js'),
    self.data.url('ace/theme-dreamweaver.js'),
    self.data.url('ace/theme-eclipse.js'),
    self.data.url('ace/theme-github.js'),
    self.data.url('ace/theme-idle_fingers.js'),
    self.data.url('ace/theme-iplastic.js'),
    self.data.url('ace/theme-katzenmilch.js'),
    self.data.url('ace/theme-kr_theme.js'),
    self.data.url('ace/theme-kuroir.js'),
    self.data.url('ace/theme-merbivore.js'),
    self.data.url('ace/theme-merbivore_soft.js'),
    self.data.url('ace/theme-mono_industrial.js'),
    self.data.url('ace/theme-monokai.js'),
    self.data.url('ace/theme-pastel_on_dark.js'),
    self.data.url('ace/theme-solarized_dark.js'),
    self.data.url('ace/theme-solarized_light.js'),
    self.data.url('ace/theme-sqlserver.js'),
    self.data.url('ace/theme-terminal.js'),
    self.data.url('ace/theme-textmate.js'),
    self.data.url('ace/theme-tomorrow.js'),
    self.data.url('ace/theme-tomorrow_night.js'),
    self.data.url('ace/theme-tomorrow_night_blue.js'),
    self.data.url('ace/theme-tomorrow_night_bright.js'),
    self.data.url('ace/theme-tomorrow_night_eighties.js'),
    self.data.url('ace/theme-twilight.js'),
    self.data.url('ace/theme-vibrant_ink.js'),
    self.data.url('ace/theme-xcode.js'),
    self.data.url('GTM-js-editor.js')
];

tabs.on('ready', function(tab){

    if (regex.test(tab.url)){
        worker = tab.attach({
            contentScriptFile: contentScriptFiles
        });
    }

});

exports.main = function(options, callbacks){

    if (worker !== null) {
        worker.port.emit('load');
    }

};

exports.onUnload = function(reason){

    if (worker !== null){
        worker.port.emit('unload');
    }

};