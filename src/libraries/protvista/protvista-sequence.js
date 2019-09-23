var ProtvistaSequence = (function (d3,ProtvistaZoomable) {
  'use strict';

  ProtvistaZoomable = ProtvistaZoomable && ProtvistaZoomable.hasOwnProperty('default') ? ProtvistaZoomable['default'] : ProtvistaZoomable;

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
      set = Reflect.set;
    } else {
      set = function set(target, property, value, receiver) {
        var base = _superPropBase(target, property);

        var desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
          if (!desc.writable) {
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set(target, property, value, receiver);
  }

  function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);

    if (!s && isStrict) {
      throw new Error('failed to set property');
    }

    return value;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var height = 40;

  var ProtVistaSequence =
  /*#__PURE__*/
  function (_ProtvistaZoomable) {
    _inherits(ProtVistaSequence, _ProtvistaZoomable);

    function ProtVistaSequence() {
      _classCallCheck(this, ProtVistaSequence);

      return _possibleConstructorReturn(this, _getPrototypeOf(ProtVistaSequence).apply(this, arguments));
    }

    _createClass(ProtVistaSequence, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        _get(_getPrototypeOf(ProtVistaSequence.prototype), "connectedCallback", this).call(this);

        this._highlightstart = parseInt(this.getAttribute("highlightstart"));
        this._highlightend = parseInt(this.getAttribute("highlightend"));
        this.sequence = this.getAttribute("sequence");

        if (this.sequence) {
          this._createSequence();
        }
      }
    }, {
      key: "_createSequence",
      value: function _createSequence() {
        _set(_getPrototypeOf(ProtVistaSequence.prototype), "svg", d3.select(this).append("div").attr("class", "").append("svg").attr("id", "").attr("width", this.width).attr("height", height), this, true);

        this.seq_bg = _get(_getPrototypeOf(ProtVistaSequence.prototype), "svg", this).append("g").attr("class", "background");
        this.axis = _get(_getPrototypeOf(ProtVistaSequence.prototype), "svg", this).append("g").attr("class", "x axis");
        this.seq_g = _get(_getPrototypeOf(ProtVistaSequence.prototype), "svg", this).append("g").attr("class", "sequence").attr("transform", "translate(0,".concat(0.75 * height, ")"));
        this.seq_g.append("text").attr("class", "base").text("T");
        this.chWidth = this.seq_g.select("text.base").node().getBBox().width * 0.8;
        this.seq_g.select("text.base").remove();
        this.highlighted = _get(_getPrototypeOf(ProtVistaSequence.prototype), "svg", this).append("rect").attr("class", "highlighted").attr("fill", "yellow").attr("height", height);
        this.refresh();
      }
    }, {
      key: "refresh",
      value: function refresh() {
        var _this = this;

        if (this.axis) {
          var ftWidth = this.getSingleBaseWidth();
          var space = ftWidth - this.chWidth;
          var half = ftWidth / 2;
          var first = Math.round(Math.max(0, this._displaystart - 2));
          var last = Math.round(Math.min(this.sequence.length, this._displayend + 1));
          var bases = space < 0 ? [] : this.sequence.slice(first, last).split("").map(function (aa, i) {
            return [1 + first + i, aa];
          });
          this.xAxis = d3.axisBottom(this.xScale).tickFormat(function (d) {
            return Number.isInteger(d) ? d : "";
          });
          this.axis.call(this.xAxis);
          this.axis.attr("transform", "translate(".concat(this.margin.left + half, ",0)"));
          this.axis.select(".domain").remove();
          this.axis.selectAll(".tick line").remove();
          this.bases = this.seq_g.selectAll("text.base").data(bases, function (d) {
            return d[0];
          });
          this.bases.enter().append("text").attr("class", "base").attr("text-anchor", "middle").attr("x", function (_ref) {
            var _ref2 = _slicedToArray(_ref, 1),
                pos = _ref2[0];

            return _this.getXFromSeqPosition(pos) + half;
          }).text(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                _ = _ref4[0],
                d = _ref4[1];

            return d;
          }).attr("style", "font-family:monospace");
          this.bases.exit().remove();
          this.bases.attr("x", function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 1),
                pos = _ref6[0];

            return _this.getXFromSeqPosition(pos) + half;
          });
          this.background = this.seq_bg.selectAll("rect.base_bg").data(bases, function (d) {
            return d[0];
          });
          this.background.enter().append("rect").attr("class", "base_bg").attr("height", height).merge(this.background).attr("width", ftWidth).attr("fill", function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 1),
                pos = _ref8[0];

            return Math.round(pos) % 2 ? "#ccc" : "#eee";
          }).attr("x", function (_ref9) {
            var _ref10 = _slicedToArray(_ref9, 1),
                pos = _ref10[0];

            return _this.getXFromSeqPosition(pos);
          });
          this.background.exit().remove();
          this.seq_g.style("opacity", Math.min(1, space));
          this.background.style("opacity", Math.min(1, space));

          if (Number.isInteger(this._highlightstart) && Number.isInteger(this._highlightend)) {
            this.highlighted.attr("x", _get(_getPrototypeOf(ProtVistaSequence.prototype), "getXFromSeqPosition", this).call(this, this._highlightstart)).style("opacity", 0.3).attr("width", ftWidth * (this._highlightend - this._highlightstart + 1));
          } else {
            this.highlighted.style("opacity", 0);
          }
        }
      }
    }, {
      key: "data",
      get: function get$$1() {
        return this.sequence;
      },
      set: function set$$1(data) {
        if (typeof data === "string") this.sequence = data;else if ("sequence" in data) this.sequence = data.sequence;

        if (this.sequence && !_get(_getPrototypeOf(ProtVistaSequence.prototype), "svg", this)) {
          this._createSequence();
        } else {
          this.refresh();
        }
      }
    }], [{
      key: "observedAttributes",
      get: function get$$1() {
        return ProtvistaZoomable.observedAttributes.concat("highlightstart", "highlightend");
      }
    }]);

    return ProtVistaSequence;
  }(ProtvistaZoomable);

  var loadComponent = function loadComponent() {
    customElements.define('protvista-sequence', ProtVistaSequence);
  }; // Conditional loading of polyfill


  if (window.customElements) {
    loadComponent();
  } else {
    document.addEventListener('WebComponentsReady', function () {
      loadComponent();
    });
  }

  return ProtVistaSequence;

}(d3,ProtvistaZoomable));
//# sourceMappingURL=protvista-sequence.js.map
