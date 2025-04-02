// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Helper function to display messages
function showMessage(element, message, isError = true) {
  const messageElement = document.createElement('p');
  messageElement.className = isError ? 'error-message' : 'success-message';
  messageElement.textContent = message;
  
  // Remove any existing messages
  const existingMessage = element.querySelector('.error-message, .success-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  element.appendChild(messageElement);
}

// Handle login form submission
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      showMessage(loginForm, 'Login successful! Redirecting...', false);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1500);
      
    } catch (error) {
      showMessage(loginForm, error.message);
    }
  });
}

// Handle signup form submission
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      email: signupForm.email.value,
      password: signupForm.password.value,
      firstName: signupForm.firstName.value,
      lastName: signupForm.lastName.value,
      role: signupForm.role.value
    };
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      
      showMessage(signupForm, 'Account created successfully! Redirecting to login...', false);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error) {
      showMessage(signupForm, error.message);
    }
  });
}