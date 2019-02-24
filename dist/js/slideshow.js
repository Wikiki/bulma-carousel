(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Slider"] = factory();
	else
		root["Slider"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_index__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_events__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__defaultOptions__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__templates__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__templates_item__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_autoplay__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_autoplay___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__components_autoplay__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }











var onPreviousClick = Symbol('onPreviousClick');
var onNextClick = Symbol('onNextClick');

var Slider = function (_EventEmitter) {
  _inherits(Slider, _EventEmitter);

  function Slider(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Slider);

    var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this));

    _this.element = __WEBPACK_IMPORTED_MODULE_1__utils_type__["a" /* isString */](selector) ? document.querySelector(selector) : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!_this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }
    _this._clickEvents = ['click', 'touch'];

    // Use Element dataset values to override options
    var elementConfig = _this.element.dataset ? Object.keys(_this.element.dataset).filter(function (key) {
      return Object.keys(__WEBPACK_IMPORTED_MODULE_3__defaultOptions__["a" /* default */]).includes(key);
    }).reduce(function (obj, key) {
      return _extends({}, obj, _defineProperty({}, key, _this.element.dataset[key]));
    }, {}) : {};
    // Set default options - dataset attributes are master
    _this.options = _extends({}, __WEBPACK_IMPORTED_MODULE_3__defaultOptions__["a" /* default */], options, elementConfig);

    _this._id = __WEBPACK_IMPORTED_MODULE_0__utils_index__["a" /* uuid */]('slider');

    _this[onPreviousClick] = _this[onPreviousClick].bind(_this);
    _this[onNextClick] = _this[onNextClick].bind(_this);

    // Initiate plugin
    _this._init();
    return _this;
  }

  /**
   * Initiate all DOM element containing datePicker class
   * @method
   * @return {Array} Array of all datePicker instances
   */


  _createClass(Slider, [{
    key: '_init',


    /****************************************************
     *                                                  *
     * PRIVATE FUNCTIONS                                *
     *                                                  *
     ****************************************************/
    /**
     * Initiate plugin instance
     * @method _init
     * @return {datePicker} Current plugin instance
     */
    value: function _init() {
      // Autoplay
      this._autoplay = new __WEBPACK_IMPORTED_MODULE_6__components_autoplay___default.a();

      this._build();
      this._bindEvents();

      if (this.options.autoplay) {
        this.startAutoplay();
      }

      this.emit('ready', this);

      return this;
    }

    /**
     * Build datePicker HTML component and append it to the DOM
     * @method _build
     * @return {datePicker} Current plugin instance
     */

  }, {
    key: '_build',
    value: function _build() {
      var _this2 = this;

      this.node = document.createRange().createContextualFragment(Object(__WEBPACK_IMPORTED_MODULE_4__templates__["a" /* default */])({
        id: this._id
      }));

      this._ui = {
        wrapper: this.node.firstChild,
        container: this.node.querySelector('.slider-container'),
        previous: this.node.querySelector('.slider-navigation-previous'),
        next: this.node.querySelector('.slider-navigation-next')
      };

      var children = Array.from(this.element.children);

      // this.element.appendChild(this.node);
      this._slides = children.map(function (child) {
        var item = document.createRange().createContextualFragment(Object(__WEBPACK_IMPORTED_MODULE_5__templates_item__["a" /* default */])());
        item.firstChild.appendChild(slide);
        _this2._autoplay.container.appendChild(item.firstChild);
        return item;
      });
      this._update();
    }

    /**
     * Update dimensions to all items
     */

  }, {
    key: '_update',
    value: function _update() {
      var _this3 = this;

      this._ratio = this._slides.length / this.options.slidesVisible;
      this._ui.container.style.width = this._ratio * 100 + '%';
      this._slides.forEach(function (slide) {
        slide.firstChild.style.width = 100 / _this3.options.slidesVisible / ratio + '%';
      });
    }

    /**
     * Bind all events
     * @method _bindEvents
     * @return {void}
     */

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this4 = this;

      this._clickEvents.forEach(function (clickEvent) {
        _this4._ui.previous.addEventListener(clickEvent, _this4[onPreviousClick]);
        _this4._ui.next.addEventListener(clickEvent, _this4[onNextClick]);
      });
    }

    /****************************************************
     *                                                  *
     * GETTERS and SETTERS                              *
     *                                                  *
     ****************************************************/

    /**
     * Get id of current datePicker
     */

  }, {
    key: onNextClick,


    /****************************************************
     *                                                  *
     * EVENTS FUNCTIONS                                 *
     *                                                  *
     ****************************************************/
    value: function value(e) {
      e.preventDefault();

      this.show(this.index + this.options.slidesToScroll);
    }
  }, {
    key: onPreviousClick,
    value: function value(e) {
      e.preventDefault();

      this.show(this.index - this.options.slidesToScroll);
    }

    /****************************************************
     *                                                  *
     * PUBLIC FUNCTIONS                                 *
     *                                                  *
     ****************************************************/

  }, {
    key: 'show',
    value: function show(index) {
      if (index < 0) {
        index = this.length - this.options.slidesVisible;
      } else if (index >= this.length || !this._slides[this.index + this.options.slidesVisible]) {
        index = 0;
      }

      var translate = index * -100 / this.length;
      this.index = index;
      this._autoplay.style.transform = 'translate3d(' + translate + '%, 0, 0)';
    }

    /**
     * Destroy Slider
     * @method destroy
     */

  }, {
    key: 'destroy',
    value: function destroy() {}
  }, {
    key: 'id',
    get: function get() {
      return this._id;
    }
  }, {
    key: 'length',
    get: function get() {
      return this._slides.length;
    }
  }, {
    key: 'maxIndex',
    get: function get() {
      return this.length - 1;
    }
  }, {
    key: 'slides',
    get: function get() {
      return this._slides;
    }
  }, {
    key: 'direction',
    get: function get() {
      return this.element.dir.toLowerCase() === 'rtl' || this.element.style.direction === 'rtl';
    }
  }], [{
    key: 'attach',
    value: function attach() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.slider';
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var instances = new Array();

      var elements = __WEBPACK_IMPORTED_MODULE_1__utils_type__["a" /* isString */](selector) ? document.querySelectorAll(selector) : Array.isArray(selector) ? selector : [selector];
      if (elements.length > 1) {
        [].forEach.call(elements, function (element) {
          instances.push(new Slider(element, options));
        });
        return instances;
      } else if (elements.length === 1) {
        return new Slider(elements[0], options);
      }
    }
  }]);

  return Slider;
}(__WEBPACK_IMPORTED_MODULE_2__utils_events__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (Slider);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return uuid; });
/* unused harmony export deepMerge */
/* unused harmony export defer */
/* unused harmony export getNodeIndex */
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var uuid = function uuid() {
	var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	return prefix + ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
		return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
	});
};
var deepMerge = function deepMerge() {
	for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
		sources[_key] = arguments[_key];
	}

	var acc = {};
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var source = _step.value;

			if (source instanceof Array) {
				if (!(acc instanceof Array)) {
					acc = [];
				}
				acc = [].concat(_toConsumableArray(acc), _toConsumableArray(source));
			} else if (source instanceof Object) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = Object.entries(source)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _ref = _step2.value;

						var _ref2 = _slicedToArray(_ref, 2);

						var key = _ref2[0];
						var value = _ref2[1];

						if (value instanceof Object && key in acc) {
							value = deepMerge(acc[key], value);
						}
						acc = _extends({}, acc, _defineProperty({}, key, value));
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return acc;
};

var defer = function defer() {
	this.promise = new Promise(function (resolve, reject) {
		this.resolve = resolve;
		this.reject = reject;
	}.bind(this));

	this.then = this.promise.then.bind(this.promise);
	this.catch = this.promise.catch.bind(this.promise);
};

var getNodeIndex = function getNodeIndex(node) {
	return [].concat(_toConsumableArray(node.parentNode.children)).indexOf(node);
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isString; });
/* unused harmony export isDate */
/* unused harmony export isObject */
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isString = function isString(unknown) {
  return typeof unknown === 'string' || !!unknown && (typeof unknown === 'undefined' ? 'undefined' : _typeof(unknown)) === 'object' && Object.prototype.toString.call(unknown) === '[object String]';
};
var isDate = function isDate(unknown) {
  return (Object.prototype.toString.call(unknown) === '[object Date]' || unknown instanceof Date) && !isNaN(unknown.valueOf());
};
var isObject = function isObject(unknown) {
  return (typeof unknown === 'function' || (typeof unknown === 'undefined' ? 'undefined' : _typeof(unknown)) === 'object' && !!unknown) && !Array.isArray(unknown);
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
  function EventEmitter() {
    var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, EventEmitter);

    this._listeners = new Map(listeners);
    this._middlewares = new Map();
  }

  _createClass(EventEmitter, [{
    key: "listenerCount",
    value: function listenerCount(eventName) {
      if (!this._listeners.has(eventName)) {
        return 0;
      }

      var eventListeners = this._listeners.get(eventName);
      return eventListeners.length;
    }
  }, {
    key: "removeListeners",
    value: function removeListeners() {
      var _this = this;

      var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var middleware = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (eventName !== null) {
        if (Array.isArray(eventName)) {
          name.forEach(function (e) {
            return _this.removeListeners(e, middleware);
          });
        } else {
          this._listeners.delete(eventName);

          if (middleware) {
            this.removeMiddleware(eventName);
          }
        }
      } else {
        this._listeners = new Map();
      }
    }
  }, {
    key: "middleware",
    value: function middleware(eventName, fn) {
      var _this2 = this;

      if (Array.isArray(eventName)) {
        name.forEach(function (e) {
          return _this2.middleware(e, fn);
        });
      } else {
        if (!Array.isArray(this._middlewares.get(eventName))) {
          this._middlewares.set(eventName, []);
        }

        this._middlewares.get(eventName).push(fn);
      }
    }
  }, {
    key: "removeMiddleware",
    value: function removeMiddleware() {
      var _this3 = this;

      var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (eventName !== null) {
        if (Array.isArray(eventName)) {
          name.forEach(function (e) {
            return _this3.removeMiddleware(e);
          });
        } else {
          this._middlewares.delete(eventName);
        }
      } else {
        this._middlewares = new Map();
      }
    }
  }, {
    key: "on",
    value: function on(name, callback) {
      var _this4 = this;

      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (Array.isArray(name)) {
        name.forEach(function (e) {
          return _this4.on(e, callback);
        });
      } else {
        name = name.toString();
        var split = name.split(/,|, | /);

        if (split.length > 1) {
          split.forEach(function (e) {
            return _this4.on(e, callback);
          });
        } else {
          if (!Array.isArray(this._listeners.get(name))) {
            this._listeners.set(name, []);
          }

          this._listeners.get(name).push({
            once: once,
            callback: callback
          });
        }
      }
    }
  }, {
    key: "once",
    value: function once(name, callback) {
      this.on(name, callback, true);
    }
  }, {
    key: "emit",
    value: function emit(name, data) {
      var _this5 = this;

      var silent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      name = name.toString();
      var listeners = this._listeners.get(name);
      var middlewares = null;
      var doneCount = 0;
      var execute = silent;

      if (Array.isArray(listeners)) {
        listeners.forEach(function (listener, index) {
          // Start Middleware checks unless we're doing a silent emit
          if (!silent) {
            middlewares = _this5._middlewares.get(name);
            // Check and execute Middleware
            if (Array.isArray(middlewares)) {
              middlewares.forEach(function (middleware) {
                middleware(data, function () {
                  var newData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

                  if (newData !== null) {
                    data = newData;
                  }
                  doneCount++;
                }, name);
              });

              if (doneCount >= middlewares.length) {
                execute = true;
              }
            } else {
              execute = true;
            }
          }

          // If Middleware checks have been passed, execute
          if (execute) {
            if (listener.once) {
              listeners[index] = null;
            }
            listener.callback({
              type: name,
              timeStamp: new Date().getTime(),
              data: data
            });
          }
        });

        // Dirty way of removing used Events
        while (listeners.indexOf(null) !== -1) {
          listeners.splice(listeners.indexOf(null), 1);
        }
      }
    }
  }]);

  return EventEmitter;
}();

/* harmony default export */ __webpack_exports__["a"] = (EventEmitter);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var defaultOptions = {
  slidesToScroll: 3,
  slidesVisible: 3,
  loop: true
};

/* harmony default export */ __webpack_exports__["a"] = (defaultOptions);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function (data) {
  return "<div id='" + data.id + " class=\"slider'>\n    <div class=\"slider-container\">\n      \n    </div>\n    <div class=\"slider-navigation\">\n      <div class=\"slider-navigation-previous\"></div>\n      <div class=\"slider-navigation-next\"></div>\n    </div>\n  </div>";
});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function (data) {
  return "<div class=\"slider-item'></div>";
});

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
	autoStautoplayart: false,
	interval: 7000
};

var Autoplay = function () {
	function Autoplay() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Autoplay);

		this.options = _extends({}, defaultOptions, options);
		this.run = false;
	}

	_createClass(Autoplay, [{
		key: 'start',
		value: function start() {
			var _this = this;

			if (this.options.autoplay) {
				if (typeof this._timer !== 'undefined') {
					this.emit('start', this);
					this._time = setInterval(function () {
						_this.stop();

						_this.emit('step', _this);

						_this.start();
					}, this.options.interval);
				}
			}
		}
	}, {
		key: 'stop',
		value: function stop() {
			this.timer = clearInterval(this.timer);
			this.emit('stop', this);
		}
	}, {
		key: 'pause',
		value: function pause() {
			var _this2 = this;

			var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			if (this.paused) {
				return;
			}
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.paused = true;
			if (speed === 0) {
				this.paused = false;
				this.autoplay();
			} else {
				this._ui.wrapper.transitionEnd(function () {
					if (!_this2) {
						return;
					}
					_this2.paused = false;
					if (!_this2.run) {
						_this2.stopAutoplay();
					} else {
						_this2.autoplay();
					}
				});
			}
		}
	}]);

	return Autoplay;
}();

/***/ })
/******/ ])["default"];
});