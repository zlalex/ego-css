/**
 * Avalon.css Front End Developer Tools
 * Author : Alex(zhouliang1006@126.com)
 * GitHub : https://github.com/zlalex
 * (C) 2017 - 2018
 */

void function(win, doc){
    'use strict';

    var _slice = Array.prototype.slice,
        _toString = Object.prototype.toString;

    function isTrue(val) {
        return val === true;
    }

    function isFalse(val) {
        return val === false;
    }

    function isFunc(fn) {
        return typeof fn === 'function';
    }

    function isStr(val) {
        return typeof val === 'string';
    }

    function isUndef(val) {
        return typeof val === 'undefined';
    }

    function isComplex(val) {
        return val !== null && typeof val === 'object';
    }

    function isObj(val) {
        return _toString.call(val).slice(8, 14) === 'Object';
    }

    function isArr(val) {
        return _toString.call(val).slice(8, 13) === 'Array';
    }

    function doEach(val, handler){
        if(isComplex(val)){
            var len;

            if((isArr(val) || isObj(val)) && val.length){
                len = val.length;
                while(len--){
                    handler.call(val[len], val[len], len);
                }
            }else if(isObj(val)){
                for(len in val){
                    handler.call(val[len], val[len], len);
                }
            }
        }else{
            return false;
        }
    }

    var $body = $('body'),
        $alSelect = $('.al-select'),
        $alTabs = $('.al-tab'),
        $alMenu = $('.al-menu');

    var avalonUtils = {
        zIndex: 2000,
        init: function(query){
            win.$ = query;
            this.alSelect();
            this.removeActive();
            this.alTabs();
            this.alMenu();
        },

        extend: function(arg){
            var key;

            if(!isObj(arg)){
                return false
            }

            for(key in arg){
                this[key] = arg[key];
            }
        },
    }

    avalonUtils.extend({

        // avalon tools
        isArr: isArr,
        isComplex: isComplex,
        isFunc: isFunc,
        isFalse: isFalse,
        isObj: isObj,
        isStr: isStr,
        isTrue: isTrue,
        isUndef: isUndef,
        doEach: doEach
    })

    avalonUtils.extend({

        // unit function
        removeActive: function(){
            $body.on('click', function(ev){
                ev = ev || win.event;
                var $target = $(ev.target);
                var $alSelectPar = $target.parents('.al-select');

                if(!$alSelectPar.length && $alSelect.hasClass('active')){
                    $alSelect.removeClass('active');
                }
            })
        },

        toggleActive: function(eachArr, cur){
            doEach(eachArr, function(el){
                var $el = $(el);

                if($el.hasClass('active') && el !== cur[0]){
                    $el.removeClass('active');
                }
            })
            cur.toggleClass('active');
        },

        alSelect: function(){
            var that = this;

            if(!$alSelect.length){
                return false;
            }

            var $alSelectInput = $('.al-select__input', $alSelect),
                $parent, $options, $alSelectText, $alSelectVal;

            $alSelectInput.on('click', function(ev){
                var $this = $(this);

                $parent = $this.parent();
                if($parent.hasClass('disabled')){
                    return false;
                }

                that.toggleActive($alSelect, $parent);

                $options = $('li', $parent);
                $alSelectText = $parent.find('.al-select__text');
                $alSelectVal = $parent.find('.al-select__val');

                $options.on('click', function(){
                    var $this = $(this),
                        index = $this.index(),
                        val, text;

                    if(!index) {
                        return false;
                    }

                    if($parent.hasClass('multiple')){
                        text = [];
                        val = [];

                        $this.toggleClass('active');
                        doEach($options, function(el, i){
                            var $el = $(el);

                            if($el.hasClass('active')){
                                text.push($el.html());
                                val.push($el.attr('al-value'));
                            }
                        })

                        text = text.reverse().join(',');
                        val = val.join(',');
                    }else{
                        text = $this.html();
                        val = $this.attr('al-value');
                        $this.addClass('active').siblings().removeClass('active');
                    }

                    $alSelectText.html(text);
                    $alSelectVal.val(val);
                })
            });
        },

        alTabs: function(){
            if(!$alTabs.length){
                return false;
            }

            $alTabs.on('click', '.al-tab__pane', function(){
                var $this = $(this);

                $this.addClass('active').siblings().removeClass('active');
            })
        },

        alMenu: function(){
            if (!$alMenu.length) {
                return false;
            }

            $alMenu.on('click', '.al-menu__title', function(){
                var $this = $(this),
                    $parent = $this.parents('.al-menu'),
                    $item = $('.al-menu__title', $parent);

                if($this.next().length){
                    $this.parent().toggleClass('active');
                }else{
                    $item.removeClass('active');
                    $this.addClass('active');
                }
            })
        },

        alCreateMask: function(){
            var index = ++this.zIndex,
                htmlStr = '<div class="al-mask" style="z-index:' + index + ';"></div>';

            $body.append(htmlStr);
        },

        alRemoveMask: function(){
            var $alMask = $('.al-mask');

            $alMask.remove();
        },

        alCreateMsgBox: function(arg){

            /**
             * @param arg {Object} message custom
             * @param arg.type {String} message type ,has warn or success or error
             * @param arg.label {String} message info
             * @param arg.callback {Function} message after close do something
             */
            var that = this;

            that.alCreateMask();
            if (!isObj(arg)) {
                throw 'arguments type error'
            }

            var icon = arg.type === 'success' ? 'al-icon__success' :
                arg.type === 'error' ? 'al-icon__delete' : 'al-icon__warning';

            var label = arg.label || '您想说点什么吗？',
                fn = arg.callback || function () { },
                index = ++that.zIndex;

            var htmlStr = '<div class="al-message" style="z-index:'+ index +';">';
                htmlStr+= '<div class="al-context__header"><i class="al-icon al-icon__close"></i></div>';
                htmlStr+= '<div class="al-context__content"><p><i class="al-icon ' + icon + '"></i><span>' + label + '</span></p></div>';
                htmlStr+= '<div class="al-context__footer"><button class="al-btn al-btn__default">确定</button></div></div>'

            $body.append(htmlStr);
            that.alCloseMsgBox();
        },

        alCloseMsgBox: function($context, callback){
            $context = $context || $('.al-message');
            callback = callback || function(){};

            var that = this,
                $btn = $('.al-btn', $context),
                $icon = $('.al-icon__close', $context);

            function doRemove (){
                $context.remove();
                that.alRemoveMask();
                callback();
            }

            $btn.on('click', doRemove);
            $icon.on('click', doRemove);
        },

        showDialog: function(elem){
            var that= this,
                $elem = $(elem),
                $closeBtn = $('.al-btn__close', $elem),
                $closeIcon = $('.al-icon__close', $elem);

            that.alCreateMask();
            $elem.removeClass('al-hide');
            elem.style.zIndex = ++that.zIndex;

            function hideDialog(){
                that.alRemoveMask();
                $elem.addClass('al-hide');
            }

            $closeBtn.on('click', hideDialog);
            $closeIcon.on('click', hideDialog);
        }
    })

    avalonUtils.extend({
        formData: function(options){
            if(!isObj(options)){
                return false
            }


        }
    })

    win.avalonUtils = avalonUtils;
}(window, document)