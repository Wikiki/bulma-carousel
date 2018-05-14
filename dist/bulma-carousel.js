(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('bulmaCarousel', factory) :
	(global.bulmaCarousel = factory());
}(this, (function () { 'use strict';

class EventEmitter {
  constructor(listeners = []) {
    this._listeners = new Map(listeners);
    this._middlewares = new Map();
  }

  listenerCount(eventName) {
    if (!this._listeners.has(eventName)) {
      return 0;
    }

    const eventListeners = this._listeners.get(eventName);
    return eventListeners.length;
  }

  removeListeners(eventName = null, middleware = false) {
    if (eventName !== null) {
      if (Array.isArray(eventName)) {
        name.forEach(e => this.removeListeners(e, middleware));
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

  middleware(eventName, fn) {
    if (Array.isArray(eventName)) {
      name.forEach(e => this.middleware(e, fn));
    } else {
      if (!Array.isArray(this._middlewares.get(eventName))) {
        this._middlewares.set(eventName, []);
      }

      (this._middlewares.get(eventName)).push(fn);
    }
  }

  removeMiddleware(eventName = null) {
    if (eventName !== null) {
      if (Array.isArray(eventName)) {
        name.forEach(e => this.removeMiddleware(e));
      } else {
        this._middlewares.delete(eventName);
      }
    } else {
      this._middlewares = new Map();
    }
  }

  on(name, callback, once = false) {
    if (Array.isArray(name)) {
      name.forEach(e => this.on(e, callback));
    } else {
      name = name.toString();
      const split = name.split(/,|, | /);

      if (split.length > 1) {
        split.forEach(e => this.on(e, callback));
      } else {
        if (!Array.isArray(this._listeners.get(name))) {
          this._listeners.set(name, []);
        }

        (this._listeners.get(name)).push({once: once, callback: callback});
      }
    }
  }

  once(name, callback) {
    this.on(name, callback, true);
  }

  emit(name, data, silent = false) {
    name = name.toString();
    let listeners = this._listeners.get(name);
    let middlewares = null;
    let doneCount = 0;
    let execute = silent;

    if (Array.isArray(listeners)) {
      listeners.forEach((listener, index) => {
        // Start Middleware checks unless we're doing a silent emit
        if (!silent) {
          middlewares = this._middlewares.get(name);
          // Check and execute Middleware
          if (Array.isArray(middlewares)) {
            middlewares.forEach(middleware => {
              middleware(data, (newData = null) => {
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
          listener.callback(data);
        }
      });

      // Dirty way of removing used Events
      while (listeners.indexOf(null) !== -1) {
        listeners.splice(listeners.indexOf(null), 1);
      }
    }
  }
}

var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    }
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}

class Carousel extends EventEmitter {
  constructor(selector) {
    super();

    this._clickEvents = ['touchstart', 'click'];

    this.carousel = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!this.carousel) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }

    /// Set default options and merge with instance defined
    this.options = Object.assign({}, {
      threshold: 50, //required min distance traveled to be considered swipe
      restraint: 100, // maximum distance allowed at the same time in perpendicular direction
      allowedTime: 500 // maximum time allowed to travel that distance
    });

    this.init();
  }

  /**
   * Initiate all DOM element containing carousel class
   * @method
   * @return {Array} Array of all Carousel instances
   */
  static attach(selector = '.carousel, .hero-carousel') {
    let carouselInstances = new Array();

    const carousels = document.querySelectorAll(selector);
    [].forEach.call(carousels, carousel => {
      setTimeout(() => {
        carouselInstances.push(new Carousel(carousel));
      }, 100);
    });
    return carouselInstances;
  }

  /**
   * Initiate plugin
   * @method init
   * @return {void}
   */
  init() {
    let forceHiddenNavigation = false;

    this.computedStyle = window.getComputedStyle(this.carousel);
    this.carouselWidth = parseInt(this.computedStyle.getPropertyValue('width'), 10);

    this.carouselContainer = this.carousel.querySelector('.carousel-container');
    this.carouselItems = this.carousel.querySelectorAll('.carousel-item');
    this.carouselItemsArray = Array.from(this.carouselItems);

    // Detect which animation is setup and auto-calculate size and transformation
    if (this.carousel.dataset.size && !this.carousel.classList.contains('carousel-animate-fade')) {
      if (this.carousel.dataset.size >= this.carouselItemsArray.length) {
        this.offset = 0;
        forceHiddenNavigation = true;
      } else {
        this.offset = this.carouselWidth / this.carousel.dataset.size;
      }

      this.carouselContainer.style.left = 0 - this.offset + 'px';
      this.carouselContainer.style.transform = `translateX(${this.offset}px)`;
      [].forEach.call(this.carouselItems, carouselItem => {
        carouselItem.style.flexBasis = `${this.offset}px`;
      });
    }

    this._initNavigation(forceHiddenNavigation);

    // If animation is fade then force carouselContainer size (due to the position: absolute)
    if (this.carousel.classList.contains('carousel-animate-fade') && this.carouselItems.length) {
      let img = this.carouselItems[0].querySelector('img');
      let scale = 1;
      if (img.naturalWidth) {
        scale = this.carouselWidth / img.naturalWidth;
        this.carouselContainer.style.height = (img.naturalHeight * scale) + 'px';
      } else {
        img.onload = () => {
          scale = this.carouselWidth / img.naturalWidth;
          this.carouselContainer.style.height = (img.naturalHeight * scale) + 'px';
        };
      }
    }

    this.currentItem = {
      carousel: this.carousel,
      node: null,
      pos: -1
    };
    this.currentItem.node = this.carousel.querySelector('.carousel-item.is-active'), this.currentItem.pos = this.currentItem.node
      ? this.carouselItemsArray.indexOf(this.currentItem.node)
      : -1;
    if (!this.currentItem.node) {
      this.currentItem.node = this.carouselItems[0];
      this.currentItem.node.classList.add('is-active');
      this.currentItem.pos = 0;
    }

    this._setOrder();

    if (this.carousel.dataset.autoplay && this.carousel.dataset.autoplay == 'true') {
      this._autoPlay(this.carousel.dataset.delay || 5000);
    }

    this._bindEvents();

    this.emit('carousel:ready', this.currentItem);
  }

  /**
   * Initiate Navigation area and Previous/Next buttons
   * @method _initNavigation
   * @return {[type]}        [description]
   */
  _initNavigation(forceHidden = false) {
    this.previousControl = this.carousel.querySelector('.carousel-nav-left');
    this.nextControl = this.carousel.querySelector('.carousel-nav-right');

    if (this.carouselItems.length <= 1 || forceHidden) {
      if (this.carouselContainer) {
        this.carouselContainer.style.left = '0';
      }
      if (this.previousControl) {
        this.previousControl.style.display = 'none';
      }
      if (this.nextControl) {
        this.nextControl.style.display = 'none';
      }
    }
  }

  /**
   * Bind all events
   * @method _bindEvents
   * @return {void}
   */
  _bindEvents() {
    if (this.previousControl) {
      this._clickEvents.forEach(clickEvent => {
        this.previousControl.addEventListener(clickEvent, e => {
          e.preventDefault();
          this._slide('previous');
          if (this._autoPlayInterval) {
            clearInterval(this._autoPlayInterval);
            this._autoPlay(this.carousel.dataset.delay || 5000);
          }
        }, supportsPassive ? { passive: true } : false);
      });
    }

    if (this.nextControl) {
      this._clickEvents.forEach(clickEvent => {
        this.nextControl.addEventListener(clickEvent, e => {
          e.preventDefault();
          this._slide('next');
          if (this._autoPlayInterval) {
            clearInterval(this._autoPlayInterval);
            this._autoPlay(this.carousel.dataset.delay || 5000);
          }
        }, supportsPassive ? { passive: true } : false);
      });
    }

    // Bind swipe events
    this.carousel.addEventListener('touchstart', e => {
      this._swipeStart(e);
    }, supportsPassive ? { passive: true } : false);
    this.carousel.addEventListener('touchmove', e => {
      if (!supportsPassive) {
        e.preventDefault();
      }
    }, supportsPassive ? { passive: true } : false);
    this.carousel.addEventListener('touchend', e => {
      this._swipeEnd(e);
    }, supportsPassive ? { passive: true } : false);
  }

  /**
   * Find next item to display
   * @method _next
   * @param  {Node} element Current Node element
   * @return {Node}         Next Node element
   */
  _next(element) {
    if (element.nextElementSibling) {
      return element.nextElementSibling;
    } else {
      return this.carouselItems[0];
    }
  }

  /**
   * Find previous item to display
   * @method _previous
   * @param  {Node}  element Current Node element
   * @return {Node}          Previous Node element
   */
  _previous(element) {
    if (element.previousElementSibling) {
      return element.previousElementSibling;
    } else {
      return this.carouselItems[this.carouselItems.length - 1];
    }
  }

  /**
   * Update each item order
   * @method _setOrder
   */
  _setOrder() {
    this.currentItem.node.style.order = '1';
    this.currentItem.node.style.zIndex = '1';
    let item = this.currentItem.node;
    let i,
      j,
      ref;
    for (
      i = j = 2, ref = this.carouselItemsArray.length; (
        2 <= ref
        ? j <= ref
        : j >= ref); i = 2 <= ref
      ? ++j
      : --j) {
      item = this._next(item);
      item.style.order = '' + i % this.carouselItemsArray.length;
      item.style.zIndex = '0';
    }
  }

  /**
   * Save current position on start swiping
   * @method _swipeStart
   * @param  {Event}    e Swipe event
   * @return {void}
   */
  _swipeStart(e) {
    e.preventDefault();

    e = e ? e : window.event;
    e = ('changedTouches' in e) ? e.changedTouches[0] : e;
    this._touch = {
      start: {
        time: new Date().getTime(), // record time when finger first makes contact with surface
        x: e.pageX,
        y: e.pageY
      },
      dist: {
        x: 0,
        y: 0
      }
    };
  }

  /**
   * Save current position on end swiping
   * @method _swipeEnd
   * @param  {Event}  e swipe event
   * @return {void}
   */
  _swipeEnd(e) {
    e.preventDefault();

    e = e ? e : window.event;
    e = ('changedTouches' in e) ? e.changedTouches[0] : e;
    this._touch.dist = {
      x: e.pageX - this._touch.start.x, // get horizontal dist traveled by finger while in contact with surface
      y: e.pageY - this._touch.start.y // get vertical dist traveled by finger while in contact with surface
    };

    this._handleGesture();
  }

  /**
   * Identify the gestureand slide if necessary
   * @method _handleGesture
   * @return {void}
   */
  _handleGesture() {
    const elapsedTime = new Date().getTime() - this._touch.start.time; // get time elapsed
    if (elapsedTime <= this.options.allowedTime) { // first condition for awipe met
      if (Math.abs(this._touch.dist.x) >= this.options.threshold && Math.abs(this._touch.dist.y) <= this.options.restraint) { // 2nd condition for horizontal swipe met
        (this._touch.dist.x < 0)
          ? this._slide('next')
          : this._slide('previous'); // if dist traveled is negative, it indicates left swipe
      }
    }
  }

  /**
   * Update slides to display the wanted one
   * @method _slide
   * @param  {String} [direction='next'] Direction in which items need to move
   * @return {void}
   */
  _slide(direction = 'next') {
    if (this.carouselItems.length) {
      this.oldItemNode = this.currentItem.node;
      this.emit('carousel:slide:before', this.currentItem);
      // initialize direction to change order
      if (direction === 'previous') {
        this.currentItem.node = this._previous(this.currentItem.node);
        // add reverse class
        if (!this.carousel.classList.contains('carousel-animate-fade')) {
          this.carousel.classList.add('is-reversing');
          this.carouselContainer.style.transform = `translateX(${ - Math.abs(this.offset)}px)`;
        }
      } else {
        // Reorder items
        this.currentItem.node = this._next(this.currentItem.node);
        // re_slide reverse class
        this.carousel.classList.remove('is-reversing');
        this.carouselContainer.style.transform = `translateX(${Math.abs(this.offset)}px)`;
      }
      this.currentItem.node.classList.add('is-active');
      this.oldItemNode.classList.remove('is-active');

      // Disable transition to instant change order
      this.carousel.classList.remove('carousel-animated');
      // Enable transition to animate order 1 to order 2
      setTimeout(() => {
        this.carousel.classList.add('carousel-animated');
      }, 50);

      this._setOrder();
      this.emit('carousel:slide:after', this.currentItem);
    }
  }

  /**
   * Initiate autoplay system
   * @method _autoPlay
   * @param  {Number}  [delay=5000] Delay between slides in milliseconds
   * @return {void}
   */
  _autoPlay(delay = 5000) {
    this._autoPlayInterval = setInterval(() => {
      this._slide('next');
    }, delay);
  }
}

return Carousel;

})));
