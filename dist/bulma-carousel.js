var bulmaCarousel = (function () {
'use strict';

class Carousel {
  constructor(selector) {
    // Determine click event depending on if we are on Touch device or not
    this._clickEvent = ('ontouchstart' in window) ? 'touchstart' : 'click';

    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }

    this.init();
  }

  /**
   * Initiate plugin
   * @method init
   * @return {void}
   */
  init() {
    this.items = Array.from(this.element.querySelectorAll('.carousel-item'));
    this.items.forEach((item) => {
      let img = item.querySelector('img');
      img.setAttribute('draggable', false);
    });
    this.computedStyle = window.getComputedStyle(this.element);

    this.previousControl = this.element.querySelector('.carousel-nav-left');
    this.nextControl = this.element.querySelector('.carousel-nav-right');

    this._bindEvents();
    this._initOrder();

    if (this.element.dataset.autoplay && this.element.dataset.autoplay == 'true') {
      this._autoPlay(this.element.dataset.delay || 5000);
    }
  }

  /**
   * Bind all events
   * @method _bindEvents
   * @return {void}
   */
  _bindEvents() {
    if (this.previousControl) {
      this.previousControl.addEventListener(this._clickEvent, (e) => {
        e.preventDefault();
        this._slide('previous');
        if (this._autoPlayInterval) {
          clearInterval(this._autoPlayInterval);
          this._autoPlay(this.element.dataset.delay || 5000);
        }
      }, false);
    }
    if (this.nextControl) {
      this.nextControl.addEventListener(this._clickEvent, (e) => {
        e.preventDefault();
        this._slide('next');
        if (this._autoPlayInterval) {
          clearInterval(this._autoPlayInterval);
          this._autoPlay(this.element.dataset.delay || 5000);
        }
      }, false);
    }

    // Bind swipe events
    this.element.addEventListener('touchstart', (e) => {
      this._swipeStart(e);
    });
    this.element.addEventListener('mousedown', (e) => {
      this._swipeStart(e);
    });

    this.element.addEventListener('touchend', (e) => {
      this._swipeEnd(e);
    });
    this.element.addEventListener('mouseup', (e) => {
      this._swipeEnd(e);
    });
  }

  /**
   * Initiate slides order
   * @method _initOrder
   * @return {void}
   */
  _initOrder() {
    const currentActiveItem = this.element.querySelector('.carousel-item.is-active');
    const currentActiveItemPos = this.items.indexOf(currentActiveItem);
    if (currentActiveItemPos) {
      this.items.push(this.items.splice(0, currentActiveItemPos));
    } else {
      this.items.unshift(this.items.pop());
    }
    this._setOrder();
  }

  /**
   * Update each slide order
   * @method _setOrder
   */
  _setOrder() {
    this.items.forEach((item, index) => {
      if (index !== 1) {
        item.style['z-index'] = '0';
      } else {
        item.style['z-index'] = '1';
      }
      item.style.order = index;
    });
  }

  /**
   * Save current position on start swiping
   * @method _swipeStart
   * @param  {Event}    e Swipe event
   * @return {void}
   */
  _swipeStart(e) {
    this._touch = {
      start: {
        x: e.clientX,
        y: e.clientY
      },
      end: {
        x: e.clientX,
        y: e.clientY
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
    this._touch.end = {
      x: e.clientX,
      y: e.clientY
    };

    this._handleGesture();
  }

  /**
   * Identify the gestureand slide if necessary
   * @method _handleGesture
   * @return {void}
   */
  _handleGesture() {
    const ratio = {
      horizontal: (this._touch.end.x - this._touch.start.x) / parseInt(this.computedStyle.getPropertyValue('width')),
      vertical: (this._touch.end.y - this._touch.start.y) / parseInt(this.computedStyle.getPropertyValue('height'))
    };

    if (ratio.horizontal > ratio.vertical && ratio.horizontal > 0.25) {
      this._slide('previous');
    }

    if (ratio.horizontal < ratio.vertical && ratio.horizontal < -0.25) {
      this._slide('next');
    }
  }

  /**
   * Update slides to display the wanted one
   * @method _slide
   * @param  {String} [direction='next'] Direction in which slide needs to move
   * @return {void}
   */
  _slide(direction = 'next') {
    if (this.items.length) {
      const currentActiveItem = this.element.querySelector('.carousel-item.is-active');
      let newActiveItem;

      currentActiveItem.classList.remove('is-active');

      // initialize direction to change order
      if (direction === 'previous') {
        // Reorder items
        this.items.unshift(this.items.pop());
        // add reverse class
        this.element.classList.add('is-reversing');
      } else {
        // Reorder items
        this.items.push(this.items.shift());
        // re_slide reverse class
        this.element.classList.remove('is-reversing');
      }

      if (this.items.length >= 1) {
        newActiveItem = this.items[1];
      } else {
        newActiveItem = this.items[0];
      }
      newActiveItem.classList.add('is-active');
      this._setOrder();

      // Disable transition to instant change order
      this.element.classList.toggle('carousel-animated');
      // Enable transition to animate order 1 to order 2
      setTimeout(() => {
        this.element.classList.toggle('carousel-animated');
      }, 50);
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

/**
 * Initiate all DOM element containing carousel class
 * @method
 * @return {[type]} [description]
 */
document.addEventListener('DOMContentLoaded', function() {
  var carousels = document.querySelectorAll('.carousel, .hero-carousel');
  [].forEach.call(carousels, function(carousel) {
    new Carousel(carousel);
  });
});

return Carousel;

}());
