(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') {
      return;
    }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = "protvista-tooltip {\n    z-index: 50000;\n    position: absolute;\n    min-width: 220px;\n    margin-top: 20px;\n    margin-left: -20px;\n    -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n    -moz-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);\n    opacity: .9;\n}\n\nprotvista-tooltip[mirror=\"H\"] {\n    margin-left: 0;\n    margin-right: 20px;\n}\n\nprotvista-tooltip .tooltip-header .tooltip-header-title,\nprotvista-tooltip .tooltip-body,\nprotvista-tooltip a,\nprotvista-tooltip a:link,\nprotvista-tooltip a:hover,\nprotvista-tooltip a:active,\nprotvista-tooltip a:visited {\n    color: #ffffff;\n}\n\nprotvista-tooltip .tooltip-header {\n    background-color: #000000;\n    line-height: 3em;\n}\n\nprotvista-tooltip .tooltip-header::before {\n    content: \" \";\n    position: absolute;\n    bottom: 100%;\n    left: 20px;\n    margin-left: -10px;\n    border-width: 10px;\n    border-style: solid;\n    border-color: transparent transparent black transparent;\n}\n\nprotvista-tooltip[mirror=\"H\"] .tooltip-header::before {\n    left: initial;\n    right: 20px;\n}\n\nprotvista-tooltip .tooltip-header .tooltip-header-title {\n    background-color: #000000;\n    font-weight: 700;\n    line-height: 1em;\n    display: inline-block;\n    vertical-align: middle;\n    padding-left: .4em;\n}\n\nprotvista-tooltip .tooltip-body {\n    padding: 1em;\n    background: #616161;\n    font-weight: normal;\n}\n\nprotvista-tooltip .tooltip-close {\n    height: 3em;\n    width: 3em;\n    display: inline-block;\n    background-repeat: no-repeat;\n    background-position: center;\n    background-image: url(\"data:image/svg+xml;charset=utf-8,%3C?xml version='1.0' encoding='UTF-8'?%3E %3Csvg width='17px' height='17px' viewBox='0 0 17 17' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='%23fff'%3E %3C!-- Generator: Sketch 48.2 (47327) - http://www.bohemiancoding.com/sketch --%3E %3Ctitle%3EArtboard%3C/title%3E %3Cdesc%3ECreated with Sketch.%3C/desc%3E %3Cdefs/%3E %3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' stroke-linecap='square'%3E %3Cg id='Artboard' stroke='%23FFFFFF' stroke-width='2'%3E %3Cg id='Group' transform='translate(2.000000, 2.000000)'%3E %3Cpath d='M0.431818182,0.431818182 L12.5103534,12.5103534' id='Line'/%3E %3Cpath d='M0.431818182,0.431818182 L12.5103534,12.5103534' id='Line-Copy' transform='translate(6.500000, 6.500000) scale(-1, 1) translate(-6.500000, -6.500000) '/%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/svg%3E\");\n    cursor: pointer;\n    vertical-align: middle;\n}\n\nprotvista-tooltip .tooltip-close:hover {\n    background-color: #1a1a1a;\n}\n\nprotvista-tooltip table td {\n    padding: .5em .5em;\n    vertical-align: top;\n}\n\nprotvista-tooltip table td:first-child {\n    font-weight: 600;\n    text-align: right\n}\n\nprotvista-tooltip table td p {\n    margin-top: 0;\n}";
  styleInject(css);

  var ProtvistaTooltip =
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(ProtvistaTooltip, _HTMLElement);

    function ProtvistaTooltip() {
      var _this;

      _classCallCheck(this, ProtvistaTooltip);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ProtvistaTooltip).call(this));
      _this._top = parseInt(_this.getAttribute("top"));
      _this._left = parseInt(_this.getAttribute("left"));
      _this._content = _this.getAttribute("content");
      _this._title = _this.getAttribute("title");
      _this._mirror = undefined;
      return _this;
    }

    _createClass(ProtvistaTooltip, [{
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue != newValue) {
          if (name === 'top' || name === 'left') {
            this["_".concat(name)] = this.getAttribute(name);

            this._updatePosition();
          } else {
            this.render();
          }
        }
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;

        this.render();
        document.getElementsByTagName('body')[0].addEventListener('click', function (e) {
          // TODO if another tooltip-trigger than the one for that feature is selected, remove the other tooltip(s)
          if (_this2.hasTooltipParent(e.target) && !e.target.classList.contains('tooltip-close') || e.target.getAttribute('tooltip-trigger') !== null) {
            return;
          }

          _this2.remove();
        });
      }
    }, {
      key: "hasTooltipParent",
      value: function hasTooltipParent(el) {
        if (!el.parentElement || el.parentElement.tagName === 'body') {
          return false;
        } else if (el.parentElement.tagName === 'PROTVISTA-TOOLTIP') return true;else {
          return this.hasTooltipParent(el.parentElement);
        }
      }
    }, {
      key: "_updatePosition",
      value: function _updatePosition() {
        this.style.top = "".concat(this._top, "px");
        this.style.left = "".concat(this._left, "px");
      }
    }, {
      key: "render",
      value: function render() {
        this._updatePosition();

        if ('undefined' !== typeof this.mirror) {
          this.mirror = this.mirror;
        }

        var html = "<div class=\"tooltip-header\">";

        if (this.closeable) {
          html = "".concat(html, "<span class=\"tooltip-close\"></span>");
        }

        html = "".concat(html, "<span class=\"tooltip-header-title\">").concat(this._title, "</span></div>\n        <div class=\"tooltip-body\">").concat(this._content, "</div>");
        this.innerHTML = html;
      }
    }, {
      key: "top",
      set: function set(top) {
        this._top = top;
      },
      get: function get() {
        return this._top;
      }
    }, {
      key: "left",
      set: function set(left) {
        this._left = left;
      },
      get: function get() {
        return this._left;
      }
    }, {
      key: "content",
      set: function set(content) {
        this._content = content;
      },
      get: function get() {
        return this._content;
      }
    }, {
      key: "title",
      set: function set(title) {
        this._title = title;
      },
      get: function get() {
        return this._title;
      }
    }, {
      key: "closeable",
      set: function set(isCloseable) {
        if (isCloseable) {
          this.setAttribute('closeable', '');
        } else {
          this.removeAttribute('closeable');
        }
      },
      get: function get() {
        return this.hasAttribute('closeable');
      }
    }, {
      key: "mirror",
      get: function get() {
        return this._mirror;
      },
      set: function set(orientation) {
        this.setAttribute('mirror', orientation);
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['top', 'left', 'mirror'];
      }
    }]);

    return ProtvistaTooltip;
  }(_wrapNativeSuper(HTMLElement));

  var loadComponent = function loadComponent() {
    customElements.define('protvista-tooltip', ProtvistaTooltip);
  }; // Conditional loading of polyfill


  if (window.customElements) {
    loadComponent();
  } else {
    document.addEventListener('WebComponentsReady', function () {
      loadComponent();
    });
  }

}());
//# sourceMappingURL=protvista-tooltip.js.map