import EventEmitter from './events';
import defaultOptions from './defaultOptions';

const BULMA_CAROUSEL_EVENTS = {
  'ready': 'carousel:ready',
  'slideBefore': 'carousel:slide:before',
  'slideAfter': 'carousel:slide:after'
};

const onSwipeStart = Symbol('onSwipeStart');
const onSwipeMove = Symbol('onSwipeMove');
const onSwipeEnd = Symbol('onSwipeEnd');

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

export default class bulmaCarousel extends EventEmitter {
  constructor(selector, options = {}) {
    super();

    this.element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }

    this._clickEvents = ['click'];
    /// Set default options and merge with instance defined
    this.options = {
      ...defaultOptions,
      ...options
    };
    if (this.element.dataset.autoplay) {
      this.options.autoplay =  this.element.dataset.autoplay;
    }
    if (this.element.dataset.delay) {
      this.options.delay =  this.element.dataset.delay;
    }
    if (this.element.dataset.size && !this.element.classList.contains('carousel-animate-fade')) {
      this.options.size = this.element.dataset.size;
    }
    if (this.element.classList.contains('carousel-animate-fade')) {
      this.options.size = 1;
    }

    this.forceHiddenNavigation = false;

    this[onSwipeStart] = this[onSwipeStart].bind(this);
    this[onSwipeMove] = this[onSwipeMove].bind(this);
    this[onSwipeEnd] = this[onSwipeEnd].bind(this);

    this.init();
  }

  /**
   * Initiate all DOM element containing carousel class
   * @method
   * @return {Array} Array of all Carousel instances
   */
  static attach(selector = '.carousel, .hero-carousel', options = {}) {
    let instances = new Array();

    const elements = document.querySelectorAll(selector);
    [].forEach.call(elements, element => {
      setTimeout(() => {
        instances.push(new bulmaCarousel(element, options));
      }, 100);
    });
    return instances;
  }

  /**
   * Initiate plugin
   * @method init
   * @return {void}
   */
  init() {
    this.container = this.element.querySelector('.carousel-container');
    this.items = this.element.querySelectorAll('.carousel-item');
    this.currentItem = {
      element: this.element,
      node: this.element.querySelector('.carousel-item.is-active'),
      pos: -1
    };
    this.currentItem.pos = this.currentItem.node ? Array.from(this.items).indexOf(this.currentItem.node) : -1;
    if (!this.currentItem.node) {
      this.currentItem.node = this.items[0];
      this.currentItem.node.classList.add('is-active');
      this.currentItem.pos = 0;
    }
    this.forceHiddenNavigation = this.items.length <= 1;

    let images = this.element.querySelectorAll('img');
    [].forEach.call(images, img => {
      img.setAttribute('draggable', false);
    });

    this._resize();
    this._setOrder();
    this._initNavigation();
    this._bindEvents();

    if (this.options.autoplay) {
      this._autoPlay(this.options.delay);
    }

    this.emit(BULMA_CAROUSEL_EVENTS.ready, this.currentItem);
  }

  _resize() {
    const computedStyle = window.getComputedStyle(this.element);
    const width = parseInt(computedStyle.getPropertyValue('width'), 10);

    // Detect which animation is setup and auto-calculate size and transformation
    if (this.options.size > 1) {
      if (this.options.size >= Array.from(this.items).length) {
        this.offset = 0;
      } else {
        this.offset = width / this.options.size;
      }

      this.container.style.left = 0 - this.offset + 'px';
      this.container.style.transform = `translateX(${this.offset}px)`;
      [].forEach.call(this.items, item => {
        item.style.flexBasis = `${this.offset}px`;
      });
    }

    // If animation is fade then force carouselContainer size (due to the position: absolute)
    if (this.element.classList.contains('carousel-animate-fade') && this.items.length) {
      let img = this.items[0].querySelector('img');
      let scale = 1;
      if (img.naturalWidth) {
        scale = width / img.naturalWidth;
        this.container.style.height = (img.naturalHeight * scale) + 'px';
      } else {
        img.onload = () => {
          scale = width / img.naturalWidth;
          this.container.style.height = (img.naturalHeight * scale) + 'px';
        }
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
          if (!supportsPassive) {
            e.preventDefault();
          }
          if (this._autoPlayInterval) {
            clearInterval(this._autoPlayInterval);
            this._autoPlay(this.optionsdelay);
          }
          this._slide('previous');
        }, supportsPassive ? { passive: true } : false);
      });
    }

    if (this.nextControl) {
      this._clickEvents.forEach(clickEvent => {
        this.nextControl.addEventListener(clickEvent, e => {
          if (!supportsPassive) {
            e.preventDefault();
          }
          if (this._autoPlayInterval) {
            clearInterval(this._autoPlayInterval);
            this._autoPlay(this.options.delay);
          }
          this._slide('next');
        }, supportsPassive ? { passive: true } : false);
      });
    }

    // Bind swipe events
    this.element.addEventListener('touchstart', this[onSwipeStart], supportsPassive ? { passive: true } : false);
    this.element.addEventListener('mousedown', this[onSwipeStart], supportsPassive ? { passive: true } : false);
    this.element.addEventListener('touchmove', this[onSwipeMove], supportsPassive ? { passive: true } : false);
    this.element.addEventListener('mousemove', this[onSwipeMove], supportsPassive ? { passive: true } : false);
    this.element.addEventListener('touchend', this[onSwipeEnd], supportsPassive ? { passive: true } : false);
    this.element.addEventListener('mouseup', this[onSwipeEnd], supportsPassive ? { passive: true } : false);
  }

  destroy() {
    this.element.removeEventListener('touchstart', this[onSwipeStart], supportsPassive ? { passive: true } : false);
    this.element.removeEventListener('mousedown', this[onSwipeStart], supportsPassive ? { passive: true } : false);
    this.element.removeEventListener('touchmove', this[onSwipeMove], supportsPassive ? { passive: true } : false);
    this.element.removeEventListener('mousemove', this[onSwipeMove], supportsPassive ? { passive: true } : false);
    this.element.removeEventListener('touchend', this[onSwipeEnd], supportsPassive ? { passive: true } : false);
    this.element.removeEventListener('mouseup', this[onSwipeEnd], supportsPassive ? { passive: true } : false);
  }

  /**
   * Save current position on start swiping
   * @method onSwipeStart
   * @param  {Event}    e Swipe event
   * @return {void}
   */
  [onSwipeStart](e) {
    if (!supportsPassive) {
      e.preventDefault();
    }

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
    }
  }

  /**
   * Save current position on end swiping
   * @method onSwipeMove
   * @param  {Event}  e swipe event
   * @return {void}
   */
  [onSwipeMove](e) {
    if (!supportsPassive) {
      e.preventDefault();
    }
  }

  /**
   * Save current position on end swiping
   * @method onSwipeEnd
   * @param  {Event}  e swipe event
   * @return {void}
   */
  [onSwipeEnd](e) {
    if (!supportsPassive) {
      e.preventDefault();
    }

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
   * Initiate Navigation area and Previous/Next buttons
   * @method _initNavigation
   * @return {[type]}        [description]
   */
  _initNavigation() {
    this.previousControl = this.element.querySelector('.carousel-nav-left');
    this.nextControl = this.element.querySelector('.carousel-nav-right');

    if (this.items.length <= 1 || this.forceHiddenNavigation) {
      if (this.container) {
        this.container.style.left = '0';
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
      i = j = 2, ref = Array.from(this.items).length; (
        2 <= ref
        ? j <= ref
        : j >= ref); i = 2 <= ref
      ? ++j
      : --j) {
      item = this._next(item);
      item.style.order = '' + i % Array.from(this.items).length;
      item.style.zIndex = '0';
    }
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
      return this.items[0];
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
      return this.items[this.items.length - 1];
    }
  }

  /**
   * Update slides to display the wanted one
   * @method _slide
   * @param  {String} [direction='next'] Direction in which items need to move
   * @return {void}
   */
  _slide(direction = 'next') {
    if (this.items.length) {
      this.oldItemNode = this.currentItem.node;
      this.emit(BULMA_CAROUSEL_EVENTS.slideBefore, this.currentItem);
      // initialize direction to change order
      if (direction === 'previous') {
        this.currentItem.node = this._previous(this.currentItem.node);
        // add reverse class
        if (!this.element.classList.contains('carousel-animate-fade')) {
          this.element.classList.add('is-reversing');
          this.container.style.transform = `translateX(${ - Math.abs(this.offset)}px)`;
        }
      } else {
        // Reorder items
        this.currentItem.node = this._next(this.currentItem.node);
        // re_slide reverse class
        this.element.classList.remove('is-reversing');
        this.container.style.transform = `translateX(${Math.abs(this.offset)}px)`;
      }
      this.currentItem.node.classList.add('is-active');
      this.oldItemNode.classList.remove('is-active');

      // Disable transition to instant change order
      this.element.classList.remove('carousel-animated');
      // Enable transition to animate order 1 to order 2
      setTimeout(() => {
        this.element.classList.add('carousel-animated');
      }, 50);

      this._setOrder();
      this.emit(BULMA_CAROUSEL_EVENTS.slideAfter, this.currentItem);
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
