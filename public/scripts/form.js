const form = document.querySelector('#contact-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const code = document.querySelector('.code');

  code.innerHTML = 'Form is being transmitted ...';

  const formData = new URLSearchParams();
  formData.append('name', document.querySelector('#name').value);
  formData.append('email', document.querySelector('#email').value);
  formData.append('subject', document.querySelector('#subject').value);
  formData.append('message', document.querySelector('#message').value);
  formData.append('captcha', document.querySelector('#captcha').value);

  fetch('/contact/contactform', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

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

      setTimeout(() => {
        code.innerHTML = '';
        code.style.color = '';
      }, 3000);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
