'use strict';

(function(){

    const aceThemes = [
        'ambiance',
        'chaos',
        'chrome',
        'clouds',
        'clouds_midnight',
        'cobalt',
        'crimson_editor',
        'dawn',
        'dreamweaver',
        'eclipse',
        'github',
        'idle_fingers',
        'iplastic',
        'katzenmilch',
        'kr_theme',
        'kuroir',
        'merbivore',
        'merbivore_soft',
        'mono_industrial',
        'monokai',
        'pastel_on_dark',
        'solarized_dark',
        'solarized_light',
        'sqlserver',
        'terminal',
        'textmate',
        'tomorrow',
        'tomorrow_night',
        'tomorrow_night_blue',
        'tomorrow_night_bright',
        'tomorrow_night_eighties',
        'twilight',
        'vibrant_ink',
        'xcode'
    ];
    const THEME_PREFIX = 'ace/theme/';
    const DEFAULT_THEME = 'monokai';
    const STYLE_CLASS = 'gtm-code-editor';
    const CONTAINER_OUTER_ID = 'ace-outer-container';
    const CONTAINER_INNER_ID = 'ace-inner-container';
    const DEFAULT_FORECOLOUR = '#646464';
    var prettyPrinter = null;

    var PrettyPrinter = function(options){

        this.initialEl = options.initialEl;
        this.isLegacy = options.isLegacy;
        this.isHtml = options.isHtml;
        this.margintop = (this.isLegacy ? '0' : '-5') + 'px';
        this.initialEl.style.display = "none";

        this.buildEl();
        this.buildAce();
        this.normalScreen();
        this.initScreen();
        this.initTheme();
        this.buildOpt(this.margintop);

        unsafeWindow.prettyPrinter = this;

    };
    PrettyPrinter.prototype = {

        buildEl: function(){

            this.el = document.createElement('div');
            this.el.style.position = 'relative';
            this.el.style.zIndex = 999;
            this.el.id = CONTAINER_OUTER_ID;

            this.editorEl = document.createElement('div');
            this.editorEl.id = CONTAINER_INNER_ID;
            this.editorEl.style.outline = '1px solid #EBEBEB';

            this.toggleContainer = document.createElement('span');

            var theme = localStorage.getItem('theme');

            this.cboTheme = document.createElement('select');
            this.cboTheme.style.marginBottom = '5px';
            this.cboTheme.style.marginRight = '2px';

            for (var i = 0, i_ = aceThemes.length; i < i_; i++){
                var option = document.createElement('option');
                option.textContent = aceThemes[i];
                if (theme !== null && theme === (THEME_PREFIX + aceThemes[i])){
                    option.setAttribute('selected', 'selected')
                }
                this.cboTheme.appendChild(option);
            }

            this.toggleEl = document.createElement('span');

            this.toggleContainer.appendChild(this.cboTheme);
            this.toggleContainer.appendChild(this.toggleEl);

            var label = document.querySelector('.gtm-text-editor-label');

            if (label !== null){
                label.appendChild(this.toggleContainer);
            }
            this.el.appendChild(this.editorEl);

            this.initialEl.parentNode.insertBefore(this.el, this.initialEl);

            document.addEventListener('keyup', this.onKeyUp.bind(this), false);
            document.addEventListener('paste', this.onKeyUp.bind(this), false);

        },

        initScreen: function () {

            if (this.isLegacy){
                this.toggleEl.addEventListener('click', this.toggle1.bind(this), false);
            }

            document.addEventListener('keydown', function(evt){
                evt = evt || unsafeWindow.event;
                if (evt.keyCode == 27 && this.screenMode === "full") {
                    this.normalScreen();
                }
            }.bind(this), false);
        },

        initTheme: function () {

            this.cboTheme.addEventListener('change', this.onThemeChange.bind(this), false);
            //this.cboTheme.addEventListener('mouseup', this.onThemeChange.bind(this), false);
            this.cboTheme.addEventListener('keydown', this.onThemeChange.bind(this), false);

            var theme = localStorage.getItem('theme');
            if (theme === null){
                theme = THEME_PREFIX + DEFAULT_THEME;
                localStorage.setItem('theme', theme);
            }

            this.aceEditor.setTheme(theme);
            this.cboTheme.selectedIndex = aceThemes.indexOf(theme.replace(THEME_PREFIX, ''));

        },

        getCodeMirrorInstance: function(){
            try {
                return unsafeWindow.angular.element('.CodeMirror')[0].CodeMirror;
            } catch (e){
                return null;
            }
        },

        getCodeFromCodeMirror: function(){

            var editor = this.getCodeMirrorInstance();
            return editor.getValue();

        },

        setCodeInCodeMirror: function(){

            var editor = this.getCodeMirrorInstance();
            editor.setValue(this.aceSession.getValue());

        },

        buildAce: function () {

            this.aceEditor = ace.edit(CONTAINER_INNER_ID);
            this.aceSession = this.aceEditor.getSession();
            this.aceEditor.$blockScrolling = Infinity;
            this.aceEditor.setShowPrintMargin(false);
            this.aceSession.setUseWorker(false);
            this.aceSession.setMode('ace/mode/' + (this.isHtml ? 'html' : 'javascript'));
            this.aceSession.setValue(this.isLegacy ? this.initialEl.value : this.getCodeFromCodeMirror());
            //this.aceSession.setFoldStyle('markbeginend');

            this.aceSession.on('change', function () {
                if (!this.isLegacy) {
                    this.setCodeInCodeMirror();
                } else {
                    this.initialEl.value = this.aceSession.getValue();
                }
            }.bind(this));

        },

        toggle1: function () {
            (this.screenMode === "normal" ? this.fullScreen() : this.normalScreen());
        },

        onThemeChange: function() {

            setTimeout(function(){
                var theme = THEME_PREFIX + this.cboTheme.selectedOptions[0].value;
                var currentTheme = localStorage.getItem('theme');
                if (currentTheme !== theme){
                    localStorage.setItem('theme', theme);
                    this.aceEditor.setTheme(theme);
                }
            }.bind(this), 100);

        },

        fullScreen: function () {

            this.screenMode = "full";
            this.el.style.position = "fixed";
            this.el.style.height = "100%";
            this.el.style.width = "100%";
            this.el.style.top = 0;
            this.el.style.zIndex = 999;
            this.el.style.left = 0;
            this.editorEl.style.width = "100%";
            this.editorEl.style.height = "100%";

            this.aceEditor.resize();
            this.buildOpt(this.margintop);

        },

        normalScreen: function () {

            this.screenMode = "normal";
            this.el.style.position = "relative";
            this.el.style.zIndex = 0;
            this.editorEl.style.height = "525px";
            this.editorEl.style.width = "100%";

            this.aceEditor.resize();
            this.buildOpt(this.margintop);

        },

        buildOpt: function (margintop) {

            var zIndex = parseInt(getComputedStyle(this.el, null)['zIndex'], 10);
            var gtmLabel = document.querySelector('label[for="4-tag.data.vendorTemplate.param.html"]');
            var foreColour = gtmLabel ? getComputedStyle(gtmLabel)['color'] : DEFAULT_FORECOLOUR;
            var old = document.querySelector('.gtm-html-expand-btn');

            if (this.isLegacy){
                replaceContent(this.toggleEl, 'Full Screen');
            } else {
                if (old){
                    var clone = old.cloneNode(true);
                    clone.id = 'gtm-ace-full-screen';
                    clone.setAttribute('title', 'Full Screen');
                    clone.removeAttribute('data-ng-click');
                    clone.removeAttribute('data-ng-if');
                    clone.addEventListener('click', this.toggle1.bind(this), false);
                    replaceContent(this.toggleEl, clone);
                } else {
                    replaceContent(this.toggleEl, 'Full Screen');
                }

            }

            //replaceContent(this.toggleEl, 'Screen Size');
            this.toggleEl.style.cursor = 'pointer';
            //this.toggleEl.style.marginRight = '2px';
            this.toggleEl.style.marginLeft = '3px';

            this.toggleContainer.className = 'gtm-ace-toggle-container';
            this.toggleContainer.appendChild(this.toggleEl);

            switch (this.screenMode){
                case 'normal':
                    var label = document.querySelector('.gtm-text-editor-label');
                    if (this.toggleContainer.parentNode !== label){
                        this.toggleContainer.parentNode.removeChild(this.toggleContainer);
                        label.appendChild(this.toggleContainer);
                    }
                    this.toggleContainer.style.position = 'relative';
                    this.toggleContainer.style.zIndex = zIndex + 1;
                    this.toggleContainer.style.color = foreColour;
                    this.toggleContainer.style.top = 0;
                    this.toggleContainer.style.right = 0;
                    break;
                //case 'full':
                //    //if (this.toggleContainer.parentNode !== this.el){
                //    //    this.toggleContainer.parentNode.removeChild(this.toggleContainer);
                //    //    this.el.insertBefore(this.toggleContainer, this.editorEl);
                //    //}
                //    //this.toggleContainer.style.position = 'fixed';
                //    //this.toggleContainer.style.zIndex = zIndex + 1;
                //    //this.toggleContainer.style.color = getComputedStyle(this.editorEl, null)['color'];
                //    //this.toggleContainer.style.top = margintop;
                //    //this.toggleContainer.style.right = '22px';
                //    break;
                default:
            }

        },

        onKeyUp: function(event){

            var w = unsafeWindow;

            if (w.angular && !this.isLegacy && event.target === document.querySelector('textarea.ace_text-input')) {
                w.angular.element(this.initialEl).change();
                //var editor = this.getCodeMirrorInstance();
                //w.CodeMirror.signal(editor, 'change');
            }

        }

    };

    function replaceContent(element, content){

        while (element.firstChild){
            element.removeChild(element.firstChild);
        }

        if (typeof content === 'string'){
            content = document.createTextNode(content);
        }

        element.appendChild(content);

    }

    function setup(){

        self.port.on('load', onLoad);
        self.port.on('unload', onUnload);

        document.addEventListener('mousedown', forceLoad, false);
        unsafeWindow.addEventListener('hashchange', forceLoad, false);
        unsafeWindow.addEventListener('scroll', forceLoad, false);
        unsafeWindow.addEventListener('load', onLoad, false);

        onLoad();

    }

    function onLoad(){

        if (!isStyleLoaded()){
            loadStyle();
        }

        forceLoad();

    }

    function onUnload(){

        unloadEditor();

    }

    function isStyleLoaded(){

        var els = [].slice.call(document.getElementsByTagName('style'));

        for (var i = 0, i_ = els.length; i < i_; i++){
            if (els[i].className === STYLE_CLASS){
                return true;
            }
        }

        return false;

    }

    function loadStyle(){

        var el = document.createElement('style');
        el.textContent = [
            '.ID-html {visibility:hidden;}',
            '.gtm-html-expand-btn-wrapper {display: none;}',
            '.gtm-ace-toggle-container {font-family: Roboto,Arial,sans-serif; font-weight: 300; font-size: 12px; float: right; line-height: 24px;}',
            '.gtm-ace-toggle-container select {height: auto; min-width: auto; padding: 0;}',
            '.gtm-ace-toggle-container .gtm-html-expand-btn {display: inline-block; position: relative; top: -1px; right: auto; padding: 0; font-size: 18px; transform: scaleY(-1); border-radius: 2px; border: 1px solid #c1c1c1; vertical-align: sub;}'
        ].join('');
        el.className = STYLE_CLASS;
        document.body.appendChild(el);

    }

    function findElement(){

        var i = 0;
        var i_ = 0;
        var els = null;
        var oldEls = [ // GTM v1
            'ID-html CT_BODY_CODE_TEXT CT_TAG_ARBITRARY_HTML_TEXTAREA',
            'ID-javascript CT_BODY_CODE_TEXT CT_TAG_ARBITRARY_JAVASCRIPT_TEXTAREA'
        ];
        var newEls = [ // GTM v2
            'tag.data.vendorTemplate.param.html',
            'variable.data.vendorTemplate.param.javascript'
        ];
        var initialEl = null;
        var isLegacy = false;
        var isHtml = true;
        var b = false;

        els = [].slice.call(document.getElementsByName(oldEls[0]));
        if (els.length > 0){
            initialEl = els[0];
            isLegacy = true;
            isHtml = true;
            b = true;
        }

        if (!b){
            els = [].slice.call(document.getElementsByName(oldEls[1]));
            if (els.length > 0){
                initialEl = els[0];
                isLegacy = true;
                isHtml = false;
                b = true;
            }
        }

        if (!b){
            els = [].slice.call(document.getElementsByName(newEls[0]));
            if (els.length > 0){
                initialEl = els[0];
                isLegacy = false;
                isHtml = true;
                b = true;
            }
        }

        if (!b){
            els = [].slice.call(document.getElementsByName(newEls[1]));
            if (els.length > 0){
                initialEl = els[0];
                isLegacy = false;
                isHtml = false;
                b = true;
            }
        }

        // Also style the code preview element.
        replaceCodePreview();

        return {
            initialEl: initialEl,
            isLegacy: isLegacy,
            isHtml: isHtml
        };

    }

    function replaceCodePreview(){

        var item = localStorage.getItem('theme');
        var theme = item === null ? THEME_PREFIX + DEFAULT_THEME : item;
        var test = document.querySelector('.codemirror-inline');

        if (test && !document.getElementById('ace-inline')){

            var ta = document.createElement('div');
            ta.id = 'ace-inline';
            ta.appendChild(document.createTextNode(unsafeWindow.angular.element('.CodeMirror')[0].CodeMirror.getValue()));

            var style = unsafeWindow.getComputedStyle(test, null);
            var w = style['width'];
            var h = (parseInt(style['height'].replace('px'), 10) + 20) + 'px';
            ta.style.width = w;
            ta.style.height = h;
            ta.style.position = 'relative';
            ta.style.zIndex = 9999;

            test.style.display = 'none';
            var p = findParent(test, 'td');
            p.insertBefore(ta, p.firstChild);

            var editor = ace.edit('ace-inline');
            editor.setTheme(theme);
            editor.getSession().setMode('ace/mode/html');
            editor.$blockScrolling = Infinity;
            editor.setShowPrintMargin(false);
            editor.getSession().setUseWorker(false);
            editor.setReadOnly(true);

            unsafeWindow.getComputedStyle(ta, null);
            var div = document.createElement('div');
            div.style.width = w;
            div.style.height = h;
            div.style.cursor = 'pointer';
            div.style.position = 'relative';
            div.style.zIndex = 99999;
            div.addEventListener('click', function(event){
                forceLoad();
            }, false);
            ta.appendChild(div);

            // wait for ace to kick in, then remove the code folding arrows
            var interval = setInterval(function(){
                var items = [].slice.call(ta.querySelectorAll('.ace_fold-widget'));
                if (items.length > 0){
                    clearInterval(interval);
                    items.forEach(function(item){
                        console.log('removed ', item);
                        item.parentNode.removeChild(item);
                    });
                    var el =  ta.querySelector('.ace_folding-enabled');
                    if (el){
                        el.className = el.className.replace('ace_folding-enabled').trim();
                    }
                }
            }, 500);

        }

    }

    function findParent(element, tagName){

        while (element.tagName.toLowerCase() !== tagName.toLowerCase()){
            element = element.parentNode;
        }

        return element;

    }

    function loadEditor() {

        var data = findElement();

        if (data.initialEl &&
            data.initialEl.style.display !== 'none' &&
            document.getElementById(CONTAINER_OUTER_ID) === null){
            prettyPrinter = new PrettyPrinter(data);
        }

    }

    function unloadEditor(){

        var data = findElement();
        var el = document.getElementById(CONTAINER_OUTER_ID);

        if (data.initialEl && el !== null){
            prettyPrinter = null;
            el.parentNode.removeChild(el);
            data.initialEl.style.display = 'block';
        }

    }

    function waitAndLoad(t) {

        setTimeout(loadEditor, t);

    }

    function forceLoad() {

        waitAndLoad(500);
        waitAndLoad(2000);
        waitAndLoad(5000);

    }

    setup();

})();