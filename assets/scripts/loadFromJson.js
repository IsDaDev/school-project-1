const pathToFile = './assets/scripts/data.json';
const galleryContainer = document.querySelector('.gallery-container');

const loadData = async (url) => {
  const request = await fetch(url);
  const response = await request.json();
  return response;
};

loadData(pathToFile).then((data) => {
  if (data) {
    data.forEach((element) => {
      buildDiv(element);
    });
  } else {
    console.log('No data returned');
  }
});

const buildDiv = (carData) => {
  const card = document.createElement('div');
  const anchor = document.createElement('a')
  const carImg = document.createElement('img');
  const carName = document.createElement('h3');
  const carBrand = document.createElement('h3');
  const carClass = document.createElement('h4');
  const emptyDiv = document.createElement('div')
  const textSection1 = document.createElement('div')
  const imgDiv = document.createElement('div')

  galleryContainer.appendChild(card);
  card.appendChild(imgDiv)
  imgDiv.appendChild(anchor);
  anchor.appendChild(carImg)
  card.appendChild(textSection1)
  textSection1.appendChild(carName);
  textSection1.appendChild(emptyDiv)
  textSection1.appendChild(carBrand);
  textSection1.appendChild(carClass);

  carName.innerHTML = carData['name'];
  carBrand.innerHTML = carData['brand']
  carClass.innerHTML = carData['class']
  carImg.src = "./assets/images/racecar.jpg"
  carImg.alt = "Racecar"

  anchor.href = "gogol"

  card.classList.add("card")
  imgDiv.classList.add("carImg")
  textSection1.classList.add("textSection1")

  /* card.addEventListener('mouseover', (element) => {
    console.log("element is pressed")
  }) */
};

