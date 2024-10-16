// array containing links for the videos and images for the hero-section
// for the image-slider on /views/homepage.ejs
const media = [
  document.querySelector('#header-video-1'),
  document.querySelector('#header-image-1'),
  document.querySelector('#header-image-2'),
];

// empty variable to keep track of the current element
let currentElement = 0;

// array containing both buttons for the control
const controlButtons = [
  document.querySelector('#control-button-left'),
  document.querySelector('#control-button-right'),
];

// loops through each button and adds an eventlistener
controlButtons.forEach((button) => {
  // if the button is clicked it checks the id
  //    if the ID is 'control-button-left it substracts the current element -1
  //    if currentElement is < than 0, it resets it to the last element
  // if the ID is not 'control-button-left' it adds 1 to the current element
  //    if the current element is greather or equal the size of the array of
  //    media-elements, it sets it back to 0
  button.addEventListener('click', () => {
    if (button.id === 'control-button-left') {
      currentElement--;
      if (currentElement < 0) {
        currentElement = media.length - 1;
      }
    } else {
      currentElement++;
      if (currentElement >= media.length) {
        currentElement = 0;
      }
    }
    // next it loops through the media array and checks if the element is not the
    // current Element, if thats the case it sets the opacity to 0, else to 1
    media.forEach((element) => {
      if (element !== media[currentElement]) {
        element.style.opacity = 0;
      } else {
        element.style.opacity = 1;
      }
    });
  });
});
