const switchers = [...document.querySelectorAll('.switcher')];

switchers.forEach(item => {
  item.addEventListener('click', function () {
    switchers.forEach(item => item.parentElement.classList.remove('is-active'));
    this.parentElement.classList.add('is-active');
  });
});

// Sign up form validation
document.querySelector('.form-signup').addEventListener('submit', function (event) {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-password-confirm').value;

  // Validate fields
  if (!name) {
    alert('Please enter your name.');
    event.preventDefault();
  } else if (!email) {
    alert('Please enter a valid email.');
    event.preventDefault();
  } else if (password !== confirmPassword) {
    alert('Passwords do not match.');
    event.preventDefault();
  } else {
    // If form is valid, show success alert
    alert('Registration successful! You can now log in with your credentials.');
  }
});

// Login form validation
document.querySelector('.form-login').addEventListener('submit', function (event) {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  // Validate fields
  if (!email || !password) {
    alert('Please enter both email and password.');
    event.preventDefault();
  } else {
    // If form is valid, show success alert
    alert('Login successful!');
  }
});
