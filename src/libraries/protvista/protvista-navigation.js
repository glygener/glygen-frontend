var ProtvistaNavigation = (function (d3) {
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

  var height = 40,
      padding = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };

  var ProtVistaNavigation =
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(ProtVistaNavigation, _HTMLElement);

    function ProtVistaNavigation() {
      var _this;

      _classCallCheck(this, ProtVistaNavigation);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ProtVistaNavigation).call(this));
      _this._x = null;
      _this.dontDispatch = false;
      return _this;
    }

    _createClass(ProtVistaNavigation, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        this.style.display = 'block';
        this.style.width = '100%';
        this.width = this.offsetWidth;
        this._length = parseFloat(this.getAttribute('length'));
        this._displaystart = parseFloat(this.getAttribute('displaystart')) || 1;
        this._displayend = parseFloat(this.getAttribute('displayend')) || this._length;
        this._highlightStart = parseFloat(this.getAttribute('highlightStart'));
        this._highlightEnd = parseFloat(this.getAttribute('highlightEnd'));
        this._onResize = this._onResize.bind(this);

        this._createNavRuler();
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        if (this._ro) {
          this._ro.unobserve(this);
        } else {
          window.removeEventListener(this._onResize);
        }
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
          this["_".concat(name)] = parseFloat(newValue);

          this._updateNavRuler();
        }
      }
    }, {
      key: "_createNavRuler",
      value: function _createNavRuler() {
        var _this2 = this;

        this._x = d3.scaleLinear().range([padding.left, this.width - padding.right]);

        this._x.domain([1, this._length]);

        this._svg = d3.select(this).append('div').attr('class', '').append('svg').attr('id', '').attr('width', this.width).attr('height', height);
        this._xAxis = d3.axisBottom(this._x);
        this._displaystartLabel = this._svg.append("text").attr('class', 'start-label').attr('x', 0).attr('y', height - padding.bottom);
        this._displayendLabel = this._svg.append("text").attr('class', 'end-label').attr('x', this.width).attr('y', height - padding.bottom).attr('text-anchor', 'end');
        this._axis = this._svg.append('g').attr('class', 'x axis').call(this._xAxis);
        this._viewport = d3.brushX().extent([[padding.left, 0], [this.width - padding.right, height * 0.51]]).on("brush", function () {
          if (d3.event.selection) {
            _this2._displaystart = d3.format("d")(_this2._x.invert(d3.event.selection[0]));
            _this2._displayend = d3.format("d")(_this2._x.invert(d3.event.selection[1]));
            if (!_this2.dontDispatch) _this2.dispatchEvent(new CustomEvent("change", {
              detail: {
                displayend: _this2._displayend,
                displaystart: _this2._displaystart,
                extra: {
                  transform: d3.event.transform
                }
              },
              bubbles: true,
              cancelable: true
            }));

            _this2._updateLabels();

            _this2._updatePolygon();
          }
        });
        this._brushG = this._svg.append("g").attr("class", "brush").call(this._viewport);

        this._brushG.call(this._viewport.move, [this._x(this._displaystart), this._x(this._displayend)]);

        this.polygon = this._svg.append("polygon").attr('class', 'zoom-polygon').attr('fill', '#777').attr('fill-opacity', '0.3');

        this._updateNavRuler();

        if ('ResizeObserver' in window) {
          this._ro = new ResizeObserver(this._onResize);

          this._ro.observe(this);
        }

        window.addEventListener("resize", this._onResize);
      }
    }, {
      key: "_onResize",
      value: function _onResize() {
        this.width = this.offsetWidth;
        this._x = this._x.range([padding.left, this.width - padding.right]);

        this._svg.attr('width', this.width);

        this._axis.call(this._xAxis);

        this._viewport.extent([[padding.left, 0], [this.width - padding.right, height * 0.51]]);

        this._brushG.call(this._viewport);

        this._updateNavRuler();
      }
    }, {
      key: "_updateNavRuler",
      value: function _updateNavRuler() {
        if (this._x) {
          this._updatePolygon();

          this._updateLabels();

          if (this._brushG) {
            this.dontDispatch = true;

            this._brushG.call(this._viewport.move, [this._x(this._displaystart), this._x(this._displayend)]);

            this.dontDispatch = false;
          }
        }
      }
    }, {
      key: "_updateLabels",
      value: function _updateLabels() {
        if (this._displaystartLabel) this._displaystartLabel.text(this._displaystart);
        if (this._displayendLabel) this._displayendLabel.attr('x', this.width).text(this._displayend);
      }
    }, {
      key: "_updatePolygon",
      value: function _updatePolygon() {
        if (this.polygon) this.polygon.attr('points', "".concat(this._x(this._displaystart), ",").concat(height / 2, "\n        ").concat(this._x(this._displayend), ",").concat(height / 2, "\n        ").concat(this.width, ",").concat(height, "\n        0,").concat(height));
      }
    }, {
      key: "width",
      get: function get() {
        return this._width;
      },
      set: function set(width) {
        this._width = width;
      }
    }, {
      key: "isManaged",
      get: function get() {
        return true;
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['length', 'displaystart', 'displayend', 'highlightStart', 'highlightEnd', 'width'];
      }
    }]);

    return ProtVistaNavigation;
  }(_wrapNativeSuper(HTMLElement));

  var loadComponent = function loadComponent() {
    customElements.define('protvista-navigation', ProtVistaNavigation);
  }; // Conditional loading of polyfill


  if (window.customElements) {
    loadComponent();
  } else {
    document.addEventListener('WebComponentsReady', function () {
      loadComponent();
    });
  }

  return ProtVistaNavigation;

}(d3));
//# sourceMappingURL=protvista-navigation.js.map
