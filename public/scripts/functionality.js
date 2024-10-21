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

// if statement to see if the array above is non-empty
if (!controlButtons.includes(null)) {
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
}

// function to change the visibility of the navigation bar
const changeNavVisible = () => {
  // if the classList contains the class visible
  if (navMobileLinks.classList.contains('visible')) {
    // it changes the display settings to none
    navMobileLinks.style.display = 'none';
    // sets the display for main back so its visible again
    document.querySelector('main').style.display = 'block';
    // background color for the navbar is removed
    navMobile.style.backgroundColor = null;
    // changes the symbol to the bar
    navMobileSymbol.children[0].src = '/assets/navbar-mobile-bars.png';
    // removes the class visible
    navMobileLinks.classList.remove('visible');
    // sets zIndex back to 10
    navMobile.style.zIndex = 10;
  } else {
    // makes the links appear
    navMobileLinks.style.display = 'block';
    // hides the main section
    document.querySelector('main').style.display = 'none';
    // changes the background for the navmobile
    navMobile.style.backgroundColor = 'rgb(76, 78, 77)';
    // changes the icon to the X
    navMobileSymbol.children[0].src = '/assets/navbar-mobile-close.png';
    // adds the class visible
    navMobileLinks.classList.add('visible');
    // zindex to 100 to put it over everything
    navMobile.style.zIndex = 100;
  }
};

// selects the whole nav, links and symbol
const navMobile = document.querySelector('.nav-mobile');
const navMobileLinks = document.querySelector('.nav-mobile-links');
const navMobileSymbol = document.querySelector('.nav-mobile-symbol');

// executes the function when the button for the mobile nav is clicked
navMobileSymbol.addEventListener('click', () => {
  changeNavVisible();
});
