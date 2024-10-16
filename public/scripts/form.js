// selects the form via ID
const form = document.querySelector('#contact-form');

// adds an eventlistener to the form to look for the event 'submit'
form.addEventListener('submit', (e) => {
  // prevents the default action of the form (which is to submit it to the server)
  e.preventDefault();

  // selects the field for the status-code (success, captcha-fail, network-fail)
  const code = document.querySelector('.code');

  // changes the innerHTML to signal the user that the form is being sent
  code.innerHTML = 'Form is being transmitted ...';

  // gets all the values from the form to submit it
  const formData = new URLSearchParams();
  formData.append('name', document.querySelector('#name').value);
  formData.append('email', document.querySelector('#email').value);
  formData.append('subject', document.querySelector('#subject').value);
  formData.append('message', document.querySelector('#message').value);
  formData.append('captcha', document.querySelector('#captcha').value);

  // fetches /contact/formdata via post request
  // sends all the data collected in the previous step
  fetch('/contact/contactform', {
    method: 'POST',
    body: formData,
  })
    // checks the response for network errors
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // if there are no errors it returns the response in json
      return response.json();
    })
    // takes the data from the response
    .then((data) => {
      // checks what the responseCode is
      // code1 = captcha is wrong
      // code2 = sucess
      // code3 = fail by error
      // --> then it sets the innerHTML of code to the corresponding
      //     statusmessage and the color (red for error, green for success)
      switch (data['responseCode']) {
        case 1:
          // fail by captcha
          code.innerHTML = data['message'];
          code.style.color = 'red';
          break;
        case 2:
          // success
          code.innerHTML = data['message'];
          code.style.color = 'green';
          break;
        case 3:
          // fail by error
          code.innerHTML = data['message'];
          code.style.color = 'red';
          break;
        default:
          break;
      }

      // the text of the statusmessage disappears out after 3 seconds
      setTimeout(() => {
        code.innerHTML = '';
        code.style.color = '';
      }, 3000);
    })
    // if there is an error it gives out the error in the console
    .catch((error) => {
      console.error('Error:', error);
    });
});

// function to getNewCaptcha
const getNewCaptcha = () => {
  // fetches /contact/resfreshCaptcha which will return a new captcha
  // method is POST
  fetch('/contact/refreshCaptcha', {
    method: 'POST',
  })
    // returns the data in json format
    .then((data) => data.json())

    // gets the data
    .then((data) => {
      // selects elements captchaX and Y and sets the innerHTML
      // to the correct number from the captcha
      document.querySelector('#captchaX').innerHTML = data.code1;
      document.querySelector('#captchaY').innerHTML = data.code2;

      // sends a fetch post request to /contact/updateCaptchaCode
      // the header is there to signal the server that it is json
      // sends the intended result for the captcha as json
      fetch('/contact/updateCaptchaCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: data.result }),
      });
    });
};

// function to select the button for captcha-refrehs
// if the button is pressed it executes getNewCaptcha()
const refreshCaptcha = document.querySelector('.refreshCaptcha');
refreshCaptcha.addEventListener('click', () => {
  getNewCaptcha();
});
