const media = [
  document.querySelector('#header-video-1'),
  document.querySelector('#header-image-1'),
  document.querySelector('#header-image-2'),
];

let currentElement = 0;

const controlButtons = [
  document.querySelector('#control-button-left'),
  document.querySelector('#control-button-right'),
];

controlButtons.forEach((button) => {
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

    media.forEach((element) => {
      if (element !== media[currentElement]) {
        element.style.opacity = 0;
      } else {
        element.style.opacity = 1;
      }
    });
  });
});
