/**
 * Avalon.css Front End Developer Tools
 * Author : Alex(zhouliang1006@126.com)
 * GitHub : https://github.com/zlalex
 * (C) 2017 - 2018
 */

void

function(window, doc) {
    'use strict';

    var _slice = Array.prototype.slice;
    var _toString = Object.prototype.toString;

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

    function isAva(val) {
        return val instanceof Avalon;
    }

    function Avalon(selector, context) {
        return new Avalon.fn.init(selector, context);
    }

    Avalon.fn = Avalon.prototype = {
        constructor: Avalon,
        name: 'Avalon',
        author: 'Alex',
        version: '1.0.0',
        contact: 'zhouliang1006@126.com',

        getElem: function(selector) {
            var elem = this.elements,
                len = this.length = elem.length;

            selector && (this.selector = selector);
            while (len--) {
                this[len] = elem[len];
            }
        }
    }

    Avalon.extend = Avalon.fn.extend = function(val, from) {
        from = from || this;
        for (var key in val) {
            from[key] = val[key];
        }
    }

    Avalon.extend({

        isFunc: isFunc,

        isTrue: isTrue,

        isFalse: isFalse,

        isUndef: isUndef,

        isComplex: isComplex,

        isArr: isArr,

        isObj: isObj,

        guid: 1,

        jsonClone: function(val, other) {
            var that = this,
                result;

            if (isComplex(val)) {
                if (isArr(val)) {
                    result = other || [];
                    val.forEach(function(item, i) {
                        if (isComplex(item)) {
                            result[i] = isArr(item) ? [] : {};
                            that.jsonClone(item, result[i]);
                        } else {
                            result[i] = item;
                        }
                    })
                } else if (isObj(val)) {
                    result = other || {};

                    for (var key in val) {
                        var item = val[key];

                        if (isComplex(item)) {
                            result[key] = isArr(item) ? [] : {};
                            that.jsonClone(item, result[key]);
                        } else {
                            result[key] = item;
                        }
                    }
                } else {
                    result = val;
                }
            } else {
                result = val;
            }
            return result;
        },

        deepClone: function(val) {
            var that = this;

            if (!val) { return val }

            var types = [Number, String, Boolean],
                result;

            types.forEach(function(type) {
                if (val instanceof type) {
                    result = type(val);
                }
            })

            if (isUndef(result)) {
                if (isArr(val)) {
                    result = [];
                    val.forEach(function(item, i) {
                        result[i] = that.deepClone(item);
                    })
                } else if (isComplex(val)) {
                    if (val.nodeType && isFunc(val.cloneNode)) {
                        result = val.cloneNode(true);
                    } else if (!val.prototype) {
                        if (val instanceof Date) {
                            result = new Date(val);
                        } else {
                            result = {};
                            for (var key in val) {
                                result[key] = that.deepClone(val[key]);
                            }
                        }
                    } else {
                        if (false && val.constructor) {
                            result = new val.constructor();
                        } else {
                            result = val;
                        }
                    }
                } else {
                    result = val;
                }
            }
            return result;
        },

        ajax: function(option) {

        },

        ready: function(fn) {
            if (!isFunc(fn)) {
                this.fn.throwErr('argument must be a function');
                return false;
            }

            doc.addEventListener('DOMContentLoaded', fn, false);
            doc.removeEventListener('DOMContentLoaded', fn, true)
        },

        each: function(val, fn) {
            var len;

            if (!isFunc(fn)) {
                this.fn.throwErr('each object handler must be a function');
                return
            }

            if ((isAva(val) || isArr(val)) && val.length) {
                len = val.length;
                while (len--) {
                    fn.call(val[len], val[len], len)
                }
            } else if (isObj(val)) {
                for (len in val) {
                    fn.call(val[len], val[len], len)
                }
            } else {
                this.fn.throwErr('argument not a Array or Object');
                return
            }
        }
    })

    Avalon.fn.extend({

        EVENTS_TYPE: 'click dblclick input blur focus change resize scroll'.split(' '),

        EVENTS: [],

        guid: 0,

        detectionStr: function(val) {
            if (isStr(val)) {
                return true;
            } else {
                this.throwErr('argument must be a string');
                return false;
            }
        },

        throwErr: function(message) {
            console.error('[Avalon warn]: ' + message + ';');
        },

        addClass: function(val) {
            if (!this.detectionStr(val)) {
                return false;
            } else if (this.length) {
                var elem = this.elements;

                Avalon.each(elem, function(el) {
                    el.classList.add(val);
                });
                return this;
            }
        },

        removeClass: function(val) {
            if (!this.detectionStr(val)) {
                return false;
            } else if (this.length) {
                var elem = this.elements;

                Avalon.each(elem, function(el) {
                    el.classList.remove(val);
                })
                return this;
            }
        },

        toggleClass: function(val) {
            if (!this.detectionStr(val)) {
                return false;
            } else if (this.length) {
                var elem = this.elements;

                Avalon.each(elem, function(el) {
                    el.classList.toggle(val);
                });
                return this;
            }
        },

        hasClass: function(val) {
            if (!this.detectionStr(val)) {
                return false;
            } else if (this.length) {
                var len = this.length,
                    elem = this.elements;

                while (len--) {
                    if (!elem[len].classList.contains(val)) {
                        return false
                    }
                }
                return true;
            }
        },

        tagName: function() {
            var target = this.elements[0],
                tagName = target.tagName;

            return tagName.toLowerCase();
        },

        getAttr: function(attr) {
            if (!this.detectionStr(attr)) {
                return false;
            } else {
                var target = this.elements[0],
                    getAttribute = target.getAttribute(attr);

                return getAttribute;
            }
        },

        val: function() {
            var elem = this.elements,
                len = this.length,
                result;

            if (len > 1) {
                result = [];

                Avalon.each(elem, function(el) {
                    el.value && result.push(el.value);
                });
            } else {
                result = elem[0].value;
            }
            return result;
        },

        find: function(selector) {
            if (!this.detectionStr(selector)) {
                return false
            } else {
                var result = this.constructor(),
                    resultElem = [],
                    tempElem = [];

                var elem = this.elements;

                Avalon.each(elem, function(el) {
                    var findElem = _slice.call(el.querySelectorAll(selector));
                    tempElem = tempElem.concat(findElem);
                })

                Avalon.each(tempElem, function(el) {
                    if (!el.findSign) {
                        el.findSign = true;
                        resultElem.push(el);
                    }
                })

                result.selector = selector;
                result.elements = resultElem;
                result.getElem();
                return result;
            }
        },

        on: function(ev, selector, handler) {
            var elem = null,
                that = this;
            /**
             * @param { String } ev: event type, click or focus...;
             * @param { String } selector: need bind event element from Avalon.elments;
             * @param { Function } handler: event handler function;
             */
            if (!isStr(ev) && this.EVENTS_TYPE.indexOf(ev) < 0) {
                this.throwErr('event type error');
                return
            } else if (isFunc(selector) && !handler) {
                elem = this.elements;
                handler = selector;
            } else if (this.detectionStr(selector) && isFunc(handler)) {
                var resultElem = this.find(selector);

                elem = resultElem.elements;
            } else {
                this.throwErr('arguments error, please try again');
                return
            }

            return Avalon.each(elem, function(el) {
                if (!el.guid) {
                    el.guid = ++that.guid;
                    that.EVENTS[el.guid] = {};
                    that.EVENTS[el.guid][ev] = [handler];
                    that.eventBind(el, ev, el.guid);
                } else {
                    var id = el.guid;

                    if (that.EVENTS[id][ev]) {
                        that.EVENTS[id][ev].push(handler);
                    } else {
                        that.EVENTS[id][ev] = [handler];
                        that.eventBind(el, ev, id);
                    }
                }
            })
        },

        eventBind: function(elem, eventType, guid) {
            var that = this;

            elem.addEventListener(eventType, function(ev) {
                Avalon.each(that.EVENTS[guid][eventType], function(fn, i) {
                    fn.call(elem, ev);
                })
            }, false);
        },

        each: function(fn) {
            var elem = this.elements;

            Avalon.each(elem, function(el, i) {
                fn(el, i);
            });
            return this;
        },

        parent: function() {

            /**
             * parent maybe not only one, we can return a new Avalon Objct from reserve parents
             */
            var result = this.constructor(),
                resultElem = [],
                currentElem = this.elements;

            Avalon.each(currentElem, function(el) {
                var tempParent = el.parentNode;

                if (tempParent && !tempParent.parSign) {

                    // currentElem.parSign attribute is confirm this is unique element;
                    // if not, resultElem has repetitive element;
                    tempParent.parSign = true;
                    resultElem.push(tempParent);
                }
            });

            Avalon.each(resultElem, function(el) {
                delete el.parSign
            });

            result.elements = resultElem;
            result.getElem();
            return result;
        },

        siblings: function() {

        },

        index: function() {

        },

        eq: function(val) {
            if (!isNaN(val) && /^\d+$/.test(val)) {
                var elem = [this.elements[val]],
                    result = this.constructor();

                result.elements = elem;
                result.getElem();
                return result;

            } else {
                this.throwErr('argument must be a Number')
            }
        }
    })

    var init = Avalon.fn.init = function(selector, context) {

        /**
         * @param { Object, String } selector: HTMLElement or Elements name(className, id, tagName);
         * @param { Object } context:  HTMLElement or Avalon Object, no important argument;
         */
        context = context || null;

        if (isAva(context)) {
            if (context.length && context.length > 1) {
                return context.find(selector);
            } else {
                context = context[0] || doc;
            }
        } else {
            context = context && context.nodeType === 1 ? context : doc;
        }

        switch (typeof selector) {
            case 'object':
                this.elements = selector.nodeType === 1 ? [selector] :
                    selector instanceof Avalon ? selector.elements : (function(that) {
                        that.throwErr('selector not a Element or Avalon Object');
                        return []
                    })(this);

                this.getElem(selector);
                break;
            default:
                var elements = context.querySelectorAll(selector);

                this.elements = _slice.call(elements);
                this.getElem(selector);
        }
    }

    init.prototype = Avalon.fn;
    window.Avalon = window.$ = Avalon;
}(window, document)