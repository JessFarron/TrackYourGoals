const loginFormHandler = async (event) => {
    event.preventDefault();
  
    // Collect values from the login form
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();
  
    if (email && password) {
      // Send a POST request to the API endpoint
      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // If successful, redirect the browser to the profile page
        const data = await response.json();

        if (data.message === 'Your Email is not verified') {
          // alert('Your Email is not verified\nA Verification Code has been sent to your email');
          openModal('Your Email is not verified\nA Verification Code has been sent to your email', 'info');
          setTimeout(()=>{}, 3000);
          document.location.replace('/confirmation');
        } else {
          document.location.replace('/profile');
        }
        
      } else {
        const errorData = await response.json();
        // alert(errorData.message); 
        openModal(`${errorData.message}`, 'danger');
      }
    }
  };  


  
  

document.querySelector('#login').addEventListener('click', loginFormHandler);