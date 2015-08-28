'use strict';

var tabs = require('sdk/tabs');
var self = require('sdk/self');
var worker = null;
const regex = /http(s)?:\/\/(www|tagmanager)\.google\.com(\/tagmanager)?\/*/;
const contentScriptFiles = [
    self.data.url('GTM-js-editor.js'),
    self.data.url('ace/ace.js'),
    self.data.url('ace/worker-css.js'),
    self.data.url('ace/worker-xml.js'),
    self.data.url('ace/worker-javascript.js'),
    self.data.url('ace/worker-html.js'),
    self.data.url('ace/mode-css.js'),
    self.data.url('ace/mode-xml.js'),
    self.data.url('ace/mode-javascript.js'),
    self.data.url('ace/mode-html.js'),
    self.data.url('ace/theme-dawn.js'),
    self.data.url('ace/theme-monokai.js')
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