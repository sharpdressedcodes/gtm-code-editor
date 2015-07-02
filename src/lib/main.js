var self = require('sdk/self');
var pageMod = require('sdk/page-mod');

pageMod.PageMod({
    include: [
        'https://www.google.com/tagmanager/*',
        'https://tagmanager.google.com/*'
    ],
    contentScriptFile: [
        self.data.url('GTM-js-editor.js'),
        self.data.url('ace/ace.js')
    ]
});