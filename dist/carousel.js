const MOUSE_EVENTS = ['click', 'touchstart'];

class Carousel {
  constructor(element) {
    this.element = element;

    this.init();
  }

  init() {
    this.items = Array.from(this.element.querySelectorAll('.carousel-item'));

    MOUSE_EVENTS.forEach((event) => {
      let previousControl = this.element.querySelector('.carousel-nav-left');
      let nextControl = this.element.querySelector('.carousel-nav-right');
      if (previousControl) {
        previousControl.addEventListener(event, (e) => {
          e.preventDefault();
          this.move('previous');
          if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoPlay(this.element.dataset.delay || 5000);
          }
        }, false);
      }
      if (nextControl) {
        nextControl.addEventListener(event, (e) => {
          e.preventDefault();
          this.move('next');
          if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoPlay(this.element.dataset.delay || 5000);
          }
        }, false);
      }
    });

    this.initOrder();

    if (this.element.dataset.autoplay && this.element.dataset.autoplay == 'true') {
      this.autoPlay(this.element.dataset.delay || 5000);
    }
  }

  initOrder() {
    const currentActiveItem = this.element.querySelector('.carousel-item.is-active');
    const currentActiveItemPos = this.items.indexOf(currentActiveItem);
    const length = this.items.length;

    if (currentActiveItemPos) {
      this.items.push(this.items.splice(0, currentActiveItemPos));
    } else {
      this.items.unshift(this.items.pop());
    }
    this.setOrder();
  }

  setOrder() {
    this.items.forEach((item, index) => {
      if (index !== 1) {
        item.style['z-index'] = '0';
      } else {
        item.style['z-index'] = '1';
      }
      item.style.order = index;
    });
  }

  move(direction = 'next') {
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
        // remove reverse class
        this.element.classList.remove('is-reversing');
      }

      if (this.items.length >= 1) {
        newActiveItem = this.items[1];
      } else {
        newActiveItem = this.items[0];
      }
      newActiveItem.classList.add('is-active');
      this.setOrder();

      // Disable transition to instant change order
      this.element.classList.toggle('carousel-animated');
      // Enable transition to animate order 1 to order 2
      setTimeout(() => {
        this.element.classList.toggle('carousel-animated');
      }, 50);
    }
  }

  autoPlay(delay = 5000) {
    this.autoplayInterval = setInterval(() => {
      this.move('next');
    }, delay);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var carousels = document.querySelectorAll('.carousel, .hero-carousel');
  [].forEach.call(carousels, function(carousel) {
    new Carousel(carousel);
  });
});
