class Carousel {
  constructor(element) {
    this.element = element;

    this.init();
  }

  init() {
    this.carouselContent = this.element.querySelector('.carousel-content');
    this.items = this.carouselContent.querySelectorAll('.carousel-item');

    this.element.querySelector('.carousel-nav-left').addEventListener('click', (e) => {
      this.prevSlide();
    }, false);
    this.element.querySelector('.carousel-nav-right').addEventListener('click', (e) => {
      this.nextSlide();
    }, false);

    this.setOrder();
  }

  setOrder(direction){
    // initialize direction to change order
    if (direction === 'previous') {
      direction = 1;
    } else if (direction === 'next') {
      direction = -1;
    }

    let nbItems = this.items.length;
    if (nbItems) {
      this.items.forEach((item, index) => {
        let newValue;
        if (item.style.order) {
          newValue = (parseInt(item.style.order, 10) + direction) % nbItems;
        } else {
          newValue = ((index + 2) % nbItems);
        }
        item.style.order = newValue ? newValue : nbItems;
      });
    }
  }

  prevSlide(evt) {
    // add reverse
    this.carouselContent.classList.add('carousel-reverse');
    // Disable transition to instant change order
    this.carouselContent.classList.toggle('carousel-animate');
    // Change order of element
    // Current order 2 visible become order 1
    this.setOrder('previous');
    // Enable transition to animate order 1 to order 2
    setTimeout(() => {
      this.carouselContent.classList.toggle('carousel-animate');
    }, 50);
  }

  nextSlide(evt) {
    // remove reverse
    this.carouselContent.classList.remove('carousel-reverse');

    // Disable transition to instant change order
    this.carouselContent.classList.toggle('carousel-animate');
    // Change order of element
    // Current order 2 visible become order 3
    this.setOrder('next');
    // Enable transition to animate order 3 to order 2
    setTimeout(() => {
      this.carouselContent.classList.toggle('carousel-animate');
    }, 50);
  };
}

window.onload = function() {
  let carousels = document.querySelectorAll('.carousel');
  if (carousels) {
    carousels.forEach(element => {
      new Carousel(element);
    })
  }
};
