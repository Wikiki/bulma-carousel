const defaultOptions = {
  size: 1,
  autoplay: false,
  stopautoplayoninteraction: false, // stop autoplay if a user interacts with the controls
  delay: 5000,
  threshold: 50, //required min distance traveled to be considered swipe
  restraint: 100, // maximum distance allowed at the same time in perpendicular direction
  allowedTime: 500 // maximum time allowed to travel that distance
};

export default defaultOptions;
