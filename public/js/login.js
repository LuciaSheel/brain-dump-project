// login.js

// DOM elements for forms and error containers
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const errorContainer = document.getElementById('login-error');
const registerErrorContainer = document.getElementById('register-error');
const registerFormContainer = document.getElementById('register-form-container');
const loginFormContainer = document.getElementById('login-form-container');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');

// Helper function to display error messages
function displayError(container, message) {
  container.textContent = message;
}

// Helper function to handle form submissions (login/register)
async function handleFormSubmit(form, url, errorContainer) {
  const username = form.querySelector('[name="username"]').value.trim();
  const password = form.querySelector('[name="password"]').value.trim();

  // Check if fields are filled
  if (!username || !password) {
    displayError(errorContainer, `${url === '/auth/login' ? 'Login' : 'Registration'} failed. Username and password are required.`);
    return;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      // Handle success
      if (url === '/auth/login') {
        window.location.href = '/notes';  // Redirect after login
      } else {
        displayError(errorContainer, 'Registration successful! You can now log in.');
        form.reset();
      }
    } else {
      const { error } = await response.json();
      displayError(errorContainer, error || `${url === '/auth/login' ? 'Login' : 'Registration'} failed.`);
    }
  } catch (error) {
    displayError(errorContainer, 'An error occurred. Please try again.');
  }
}

// Event listener for register form submission
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleFormSubmit(registerForm, '/auth/register', registerErrorContainer);
});

// Event listener for login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleFormSubmit(loginForm, '/auth/login', errorContainer);
});

// Function to switch between forms (login/register)
function switchForm(activeTab) {
  if (activeTab === 'register') {
    registerFormContainer.classList.add('active');
    loginFormContainer.classList.remove('active');
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
  } else {
    registerFormContainer.classList.remove('active');
    loginFormContainer.classList.add('active');
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
  }
}

// Event listeners for tab switching
loginTab.addEventListener('click', () => switchForm('login'));
registerTab.addEventListener('click', () => switchForm('register'));

// Set the initial state to show the login form
switchForm('login');
