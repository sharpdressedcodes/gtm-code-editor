(function(){

    const bright = "ace/theme/ace-dawn";
    const dark = "ace/theme/monokai";
    const STYLE_CLASS = 'gtm-code-editor';
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
            this.el.id = 'maxWidth';

            this.editorEl = document.createElement('div');
            this.editorEl.id = 'description';

            this.toggleContainer = document.createElement('span');
            this.toggleEl = document.createElement('span');
            this.sep = document.createElement('span');
            this.toggleEl2 = document.createElement('span');

            this.toggleContainer.appendChild(this.toggleEl);
            this.toggleContainer.appendChild(this.sep);
            this.toggleContainer.appendChild(this.toggleEl2);

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

            this.toggleEl.addEventListener('click', this.toggle1.bind(this), false);

            document.addEventListener('keydown', function(evt){
                evt = evt || unsafeWindow.event;
                if (evt.keyCode == 27 && this.screenMode === "full") {
                    this.normalScreen();
                }
            }.bind(this), false);
        },

        initTheme: function () {

            this.toggleEl2.addEventListener('click', this.toggle2.bind(this), false);

            if (!localStorage.getItem("theme")) {
                this.aceEditor.setTheme(dark);
                localStorage.setItem("theme", dark);
            } else {
                if (localStorage.getItem("theme") === dark){
                    this.aceEditor.setTheme(dark);
                    localStorage.setItem("theme", dark);
                } else {
                    this.aceEditor.setTheme(bright);
                    localStorage.setItem("theme", bright);
                }
            }
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

            this.aceEditor = ace.edit("description");
            this.aceSession = this.aceEditor.getSession();
            this.aceSession.setMode('ace/mode/' + (this.isHtml ? 'html' : 'javascript'));
            this.aceSession.setValue(this.isLegacy ? this.initialEl.value : this.getCodeFromCodeMirror());
            this.aceSession.setFoldStyle('markbeginend');

            this.aceSession.on("change", function () {
                if (!this.isLegacy) {
                    this.setCodeInCodeMirror();
                } else {
                    this.initialEl.value = this.aceSession.getValue();
                }
                this.aceSession.setUseWorker(false);
            }.bind(this));

        },

        toggle1: function () {
            (this.screenMode === "normal" ? this.fullScreen() : this.normalScreen());
        },

        toggle2: function () {

            if (localStorage.getItem("theme") === bright){
                this.aceEditor.setTheme(dark);
                localStorage.setItem("theme", dark);
            } else {
                this.aceEditor.setTheme(bright);
                localStorage.setItem("theme", bright);
            }
            this.buildOpt(this.margintop);
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

            var _self = this;
            var zIndex = parseInt(getComputedStyle(this.el, null)['zIndex'], 10);

            replaceContent(this.toggleEl2, 'Change Theme');
            this.toggleEl2.style.cursor = "pointer";
            this.toggleEl2.style.marginRight = "10px";

            replaceContent(this.sep, '-');
            this.sep.style.marginRight = "10px";

            replaceContent(this.toggleEl, 'Screen Size');
            this.toggleEl.style.cursor = "pointer";
            this.toggleEl.style.marginRight = "10px";

            replaceContent(this.toggleContainer, this.toggleEl2);
            this.toggleContainer.className = 'gtm-ace-toggle-container';
            this.toggleContainer.appendChild(this.sep);
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
                    this.toggleContainer.style.color = '#646464';
                    this.toggleContainer.style.top = 0;
                    this.toggleContainer.style.right = 0;
                    break;
                case 'full':
                    if (this.toggleContainer.parentNode !== this.el){
                        this.toggleContainer.parentNode.removeChild(this.toggleContainer);
                        this.el.insertBefore(this.toggleContainer, this.editorEl);
                    }
                    this.toggleContainer.style.position = 'fixed';
                    this.toggleContainer.style.zIndex = zIndex + 1;
                    this.toggleContainer.style.color = _self.aceEditor.getTheme() === dark ? '#dfdfdf' : '#646464';
                    this.toggleContainer.style.top = margintop;
                    this.toggleContainer.style.right = '22px';
                    break;
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
            '.gtm-ace-toggle-container {font-family: Roboto,Arial,sans-serif; font-weight: 300; font-size: 12px; float: right; line-height: 24px;}'
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

        var item = localStorage.getItem('theme');
        var theme = item !== null && item !== dark ? 'default' : 'monokai';

        // Also style the code preview element.
        if (theme === 'monokai'){
            els = [].slice.call(document.querySelectorAll('.cm-s-default'));
            for (i = 0, i_ = els.length; i < i_; i++){
                els[i].className = els[i].className.replace('cm-s-default', 'cm-s-monokai');
            }
        } else {
            els = [].slice.call(document.querySelectorAll('.cm-s-monokai'));
            for (i = 0, i_ = els.length; i < i_; i++){
                els[i].className = els[i].className.replace('cm-s-monokai', 'cm-s-default');
            }
        }

        // GTM has a mouseover effect for each 'step'. When the dark theme is selected,
        // the background goes white during mouseover. Setting the background-color
        // to !important fixes this issue.
        var colour = (theme === 'monokai' ? '272822' : 'ffffff');
        els = [].slice.call(document.querySelectorAll('[class*="cm-s-"]'));
        for (i = 0, i_ = els.length; i < i_; i++){
            els[i].setAttribute('style', 'background-color: #' + colour + '!important');
        }

        return {
            initialEl: initialEl,
            isLegacy: isLegacy,
            isHtml: isHtml
        };

    }

    function loadEditor() {

        var data = findElement();

        if (data.initialEl &&
            data.initialEl.style.display !== 'none' &&
            document.getElementById('maxWidth') === null){
            prettyPrinter = new PrettyPrinter(data);
        }

    }

    function unloadEditor(){

        var data = findElement();
        var el = document.getElementById('maxWidth');

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

        waitAndLoad(40);
        waitAndLoad(10);
        waitAndLoad(200);
        waitAndLoad(500);
        waitAndLoad(1000);
        waitAndLoad(2000);
        waitAndLoad(5000);
        waitAndLoad(10000);
        waitAndLoad(15000);

    }

    setup();

})();