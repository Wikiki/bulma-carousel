'use strict';

const bulmaCarousel = require('../src/js/index').default;

describe('bulmaCarousel', () => {
  test('Should throw exception if instanciate with no/wrong selector', () => {
    expect(() => {
      new bulmaCarousel();
    }).toThrow('An invalid selector or non-DOM node has been provided.');
  });

  test('Should return an array', () => {
    var instances = bulmaCarousel.attach('.selector');
    expect(Array.isArray(instances)).toBe(true);
  });

  test('Should return an array of bulmaCarousel instances', () => {
    var instances = bulmaCarousel.attach();
    instances.every(i => expect(i).toBeInstanceOf(bulmaCarousel));
  });
});
