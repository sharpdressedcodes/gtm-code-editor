(function(){

    var PrettyPrinter = function(options){

        this.initialEl = options.initialEl;
        this.isLegacy = options.isLegacy;
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

    var bright = "ace/theme/ace-dawn";
    var dark = "ace/theme/monokai";

    PrettyPrinter.prototype = {

        buildEl: function(){

            this.el = document.createElement("div");
            this.el.style.position = "relative";
            this.el.style.zIndex = 999;
            this.el.id = "maxWidth";

            this.editorEl = document.createElement("div");
            this.editorEl.id = "description";

            this.toggleEl = document.createElement("div");
            this.slash = document.createElement("div");
            this.toggleEl2 = document.createElement("div");
            this.toggle = document.createElement("div");

            this.el.appendChild(this.toggle);
            this.el.appendChild(this.slash);
            this.el.appendChild(this.toggleEl);
            this.el.appendChild(this.toggleEl2);
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

        buildAce: function () {

            this.aceEditor = ace.edit("description");
            this.aceSession = this.aceEditor.getSession();
            this.aceSession.setMode("ace/mode/javascript");
            this.aceSession.setValue(this.initialEl.value);
            this.aceSession.on("change", function () {
                this.initialEl.value = this.aceSession.getValue();
                // sharpdressedcodes
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

            var ScrollBarWidth = 2,
                OSName = "Unknown OS",
                _self = this,
                css = 'opacity: 0.4; position: absolute; right: 0;z-index: 999; font-size: 12px; margin-top: ' + margintop;

            if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";

            OSName === "MacOS" ? ScrollBarWidth = 17 : ScrollBarWidth = 22;

            function underlineOn(elem) {
                _self.aceEditor.getTheme() === dark ? document.getElementById(elem).style.borderBottom = "solid white" : document.getElementById(elem).style.borderBottom = "solid black";
                document.getElementById(elem).style.borderBottomWidth = "1px";
            }

            function underlineOff(elem) {
                document.getElementById(elem).style.borderBottom = "";
            }

            function changeColor() {
                var tab = ["screen", "slash", "theme", "toggle"],
                    i;

                if (_self.aceEditor.getTheme() === dark)
                    for (i = 0; i < tab.length; i++)
                        document.getElementById(tab[i]).style.color = "white";
                else
                    for (i = 0; i < tab.length; i++)
                        document.getElementById(tab[i]).style.color = "black";
            }

            this.toggleEl.innerHTML = "Screen size";
            this.toggleEl.id = "screen";
            this.toggleEl.style.cssText = css;
            this.toggleEl.style.cursor = "pointer";
            this.toggleEl.style.marginRight = ScrollBarWidth + "px";

            this.toggleEl.addEventListener('mouseover', function(){
                underlineOn("screen");
            }, false);
            this.toggleEl.addEventListener('mouseout', function(){
                underlineOff("screen");
            }, false);

            this.slash.innerHTML = '/';
            this.slash.id = "slash";
            this.slash.style.cssText = css;
            this.slash.style.marginRight = ScrollBarWidth + 69 + "px";

            this.toggleEl2.innerHTML = "Color theme";
            this.toggleEl2.id = "theme";
            this.toggleEl2.style.cssText = css;
            this.toggleEl2.style.cursor = "pointer";
            this.toggleEl2.style.marginRight = ScrollBarWidth + 77 + "px";

            this.toggleEl2.addEventListener('mouseover', function(){
                underlineOn("theme");
            }, false);
            this.toggleEl2.addEventListener('mouseout', function(){
                underlineOff("theme");
            }, false);
            this.toggleEl2.addEventListener('mousemove', function(){
                underlineOn("theme");
            }, false);

            this.toggle.innerHTML = 'Toggle:';
            this.toggle.id = "toggle";
            this.toggle.style.cssText = css;
            this.toggle.style.marginRight = ScrollBarWidth + 148 + "px";

            changeColor();

        },

        onKeyUp: function(event){

            var w = unsafeWindow;

            if (w.angular && !this.isLegacy && event.target === document.querySelector('textarea.ace_text-input')) {
                //this.initialEl.className = 'ng-scope ng-valid ng-dirty ng-valid-parse ng-valid-server ng-touched';
                w.angular.element(this.initialEl).change();
            }

        }

    };

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

        for (i = 0, i_ = oldEls.length; i < i_; i++){
            els = [].slice.call(document.getElementsByName(oldEls[i]));
            if (els.length > 0){
                initialEl = els[0];
                isLegacy = true;
                break;
            }
        }
        if (!this.isLegacy){
            for (i = 0, i_ = newEls.length; i < i_; i++){
                els = [].slice.call(document.getElementsByName(newEls[i]));
                if (els.length > 0){
                    initialEl = els[0];
                    break;
                }
            }
        }

        return {
            initialEl: initialEl,
            isLegacy: isLegacy
        };

    }

    function loadEditor() {

        var data = findElement();

        if (data.initialEl &&
            data.initialEl.style.display !== 'none' &&
            document.getElementById('maxWidth') === null){
            new PrettyPrinter(data);
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

    document.addEventListener('mousedown', forceLoad, false);
    unsafeWindow.addEventListener('load', function(){

        var sheet = document.createElement('style');

        sheet.innerHTML = ".ID-html { visibility:hidden }";

        document.body.appendChild(sheet);

    }, false);
    unsafeWindow.addEventListener('hashchange', forceLoad, false);
    unsafeWindow.addEventListener('scroll', forceLoad, false);

    forceLoad();

})();

//(function () {
//
//    var PrettyPrinter = function(){
//
//
//        //this.oldInitialEl = (document.getElementsByClassName("ID-html CT_BODY_CODE_TEXT CT_TAG_ARBITRARY_HTML_TEXTAREA")[0] ||
//        //document.getElementsByClassName("ID-javascript CT_BODY_CODE_TEXT CT_TAG_ARBITRARY_JAVASCRIPT_TEXTAREA")[0]);
//        //this.newInitialEl = (document.getElementsByName('tag.data.vendorTemplate.param.html')[0] ||
//        //document.getElementsByName('variable.data.vendorTemplate.param.javascript')[0]);
//        //
//        //
//        //!this.oldInitialEl ? (this.initialEl = this.newInitialEl, this.margintop = "-5px") : (this.initialEl = this.oldInitialEl, this.margintop = "0px");
//
//        this.initialEl.style.display = "none";
//        this.buildEl();
//        this.buildAce();
//        this.normalScreen();
//        this.initScreen();
//        this.initTheme();
//        this.buildOpt(this.margintop);
//
//        window.prettyPrinter = this;
//
//    },
//
//    bright = "ace/theme/ace-dawn",
//    dark = "ace/theme/monokai";
//
//    PrettyPrinter.prototype = {
//        buildEl: function () {
//
//            this.el = document.createElement("div");
//            this.el.style.position = "relative";
//            this.el.style.zIndex = 999;
//            this.el.id = "maxWidth";
//
//            this.editorEl = document.createElement("div");
//            this.editorEl.id = "description";
//
//            this.toggleEl = document.createElement("div");
//
//            this.slash = document.createElement("div");
//
//            this.toggleEl2 = document.createElement("div");
//
//            this.toggle = document.createElement("div");
//
//            this.el.appendChild(this.toggle);
//
//            this.el.appendChild(this.slash);
//
//            this.el.appendChild(this.toggleEl);
//
//            this.el.appendChild(this.toggleEl2);
//
//            this.el.appendChild(this.editorEl);
//
//            this.initialEl.parentNode.insertBefore(this.el, this.initialEl);
//        },
//        initScreen: function () {
//            this.toggleEl.onclick = this.toggle1.bind(this);
//            document.onkeydown = function (evt) {
//                evt = evt || window.event;
//                if (evt.keyCode == 27 && this.screenMode === "full") {
//                    this.normalScreen();
//                }
//            }.bind(this);
//        },
//        initTheme: function () {
//            this.toggleEl2.onclick = this.toggle2.bind(this);
//            if (!localStorage.getItem("theme")) {
//                this.aceEditor.setTheme(dark), localStorage.setItem("theme", dark);
//            } else {
//                localStorage.getItem("theme") === dark ? (this.aceEditor.setTheme(dark), localStorage.setItem("theme", dark)) : (this.aceEditor.setTheme(bright), localStorage.setItem("theme", bright));
//            }
//        },
//        buildAce: function () {
//            this.aceEditor = ace.edit("description");
//            this.aceSession = this.aceEditor.getSession();
//            this.aceSession.setMode("ace/mode/javascript");
//            this.aceSession.setValue(this.initialEl.value);
//            this.aceSession.on("change", function () {
//                this.initialEl.value = this.aceSession.getValue();
//
//                // sharpdressedcodes
//                this.aceSession.setUseWorker(false);
//
//            }.bind(this))
//        },
//        toggle1: function () {
//            (this.screenMode === "normal" ? this.fullScreen() : this.normalScreen());
//        },
//        toggle2: function () {
//            localStorage.getItem("theme") === bright ? (this.aceEditor.setTheme(dark), localStorage.setItem("theme", dark)) : (this.aceEditor.setTheme(bright), localStorage.setItem("theme", bright));
//            this.buildOpt(this.margintop);
//        },
//        fullScreen: function () {
//            this.screenMode = "full";
//            this.el.style.position = "fixed";
//            this.el.style.height = "100%";
//            this.el.style.width = "100%";
//            this.el.style.top = 0;
//            this.el.style.zIndex = 999;
//            this.el.style.left = 0;
//            this.editorEl.style.width = "100%";
//            this.editorEl.style.height = "100%";
//            this.aceEditor.resize();
//            this.buildOpt(this.margintop);
//        },
//        normalScreen: function () {
//            this.screenMode = "normal";
//            this.el.style.position = "relative";
//            this.el.style.zIndex = 0;
//            this.editorEl.style.height = "525px";
//            this.editorEl.style.width = "100%";
//            this.aceEditor.resize();
//            this.buildOpt(this.margintop);
//        },
//
//        buildOpt: function (margintop) {
//            var ScrollBarWidth = 2,
//                OSName = "Unknown OS",
//                _self = this,
//                css = 'opacity: 0.4; position: absolute; right: 0;z-index: 999; font-size: 12px; margin-top: ' + margintop;
//
//            if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
//
//            OSName === "MacOS" ? ScrollBarWidth = 17 : ScrollBarWidth = 22;
//
//            function underlineOn(elem) {
//                _self.aceEditor.getTheme() === dark ? document.getElementById(elem).style.borderBottom = "solid white" : document.getElementById(elem).style.borderBottom = "solid black";
//                document.getElementById(elem).style.borderBottomWidth = "1px";
//            }
//
//            function underlineOff(elem) {
//                document.getElementById(elem).style.borderBottom = "";
//            }
//
//            function changeColor() {
//                var tab = ["screen", "slash", "theme", "toggle"],
//                    i;
//
//                if (_self.aceEditor.getTheme() === dark)
//                    for (i = 0; i < tab.length; i++)
//                        document.getElementById(tab[i]).style.color = "white";
//                else
//                    for (i = 0; i < tab.length; i++)
//                        document.getElementById(tab[i]).style.color = "black";
//            }
//
//            this.toggleEl.innerHTML = "Screen size";
//            this.toggleEl.id = "screen";
//            this.toggleEl.style.cssText = css;
//            this.toggleEl.style.cursor = "pointer";
//            this.toggleEl.style.marginRight = ScrollBarWidth + "px";
//            this.toggleEl.onmouseover = function () {
//                underlineOn("screen");
//            };
//            this.toggleEl.onmouseout = function () {
//                underlineOff("screen");
//            };
//
//            this.slash.innerHTML = '/';
//            this.slash.id = "slash";
//            this.slash.style.cssText = css;
//            this.slash.style.marginRight = ScrollBarWidth + 69 + "px";
//
//            this.toggleEl2.innerHTML = "Color theme";
//            this.toggleEl2.id = "theme";
//            this.toggleEl2.style.cssText = css;
//            this.toggleEl2.style.cursor = "pointer";
//            this.toggleEl2.style.marginRight = ScrollBarWidth + 77 + "px";
//            this.toggleEl2.onmouseover = function () {
//                underlineOn("theme");
//            };
//            this.toggleEl2.onmouseout = function () {
//                underlineOff("theme");
//            };
//            this.toggleEl2.onmousemove = function () {
//                underlineOn("theme");
//            };
//
//            this.toggle.innerHTML = 'Toggle:';
//            this.toggle.id = "toggle";
//            this.toggle.style.cssText = css;
//            this.toggle.style.marginRight = ScrollBarWidth + 148 + "px";
//
//            changeColor();
//
//        }
//    };
//    window.onload = function () {
//        var sheet = document.createElement('style');
//        sheet.innerHTML = ".ID-html { visibility:hidden }";
//        document.body.appendChild(sheet);
//    };
//    var loadEditor = function () {
//        var textarea = (document.getElementsByClassName("ID-html CT_BODY_CODE_TEXT CT_TAG_ARBITRARY_HTML_TEXTAREA")[0] ||
//        document.getElementsByClassName("ID-javascript CT_BODY_CODE_TEXT CT_TAG_ARBITRARY_JAVASCRIPT_TEXTAREA")[0] ||
//        document.getElementsByName('tag.data.vendorTemplate.param.html')[0] ||
//        document.getElementsByName('variable.data.vendorTemplate.param.javascript')[0]);
//        //if (textarea && textarea.style.display !==  "none" ){
//        if (textarea && textarea.style.display !== "none" && document.getElementById('maxWidth') === null) {
//            new PrettyPrinter();
//        }
//    };
//    var waitAndLoad = function (t) {
//        setTimeout(function () {
//            loadEditor();
//        }, t)
//    };
//    var forceLoad = function () {
//        waitAndLoad(40);
//        waitAndLoad(10);
//        waitAndLoad(200);
//        waitAndLoad(500);
//        waitAndLoad(1000);
//        waitAndLoad(2000);
//        waitAndLoad(5000);
//        waitAndLoad(10000);
//        waitAndLoad(15000);
//    };
//    window.onhashchange = function () {
//        forceLoad();
//    };
//    window.onscroll = function () {
//        forceLoad();
//    };
//    document.onmousedown = function () {
//        forceLoad();
//    };
//    document.onkeyup = function () {
//        if (!this.oldInitialEl) {
//            // gk
//            var el = document.getElementsByName('tag.data.vendorTemplate.param.html')[0] || document.getElementsByName('variable.data.vendorTemplate.param.javascript')[0];
//            el.className = 'ng-scope ng-valid ng-dirty ng-valid-parse ng-valid-server ng-touched';
//
//            var w = unsafeWindow;
//            w.console.log('onKeyUp', w.angular, arguments, el);
//            w.angular.element(el).change();
//        }
//    };
//
//    forceLoad();
//
//})();