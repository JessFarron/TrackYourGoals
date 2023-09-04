const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const name = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const passwordConfirmation = document.querySelector('#password').value.trim();
  
    if (name && email && password && passwordConfirmation) {
      if (password.length > 8) {
        if (password === passwordConfirmation) { 
          const response = await fetch('/api/user', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
            headers: { 'Content-Type': 'application/json' },
          });
    
          if (response.ok) {
            const data = await response.json();
            if (data.message === 'Email already in use.') {
              // alert('This email already exists');
              openModal('This email already exists', 'danger');

            } else {
              document.location.replace('/confirmation');
            }
          } else {
            // alert(response.statusText);
            openModal(`${response.statusText}`, 'danger');

          }
        } else {
          // alert('Passwords do not match');
          openModal('Passwords do not match', 'danger');

        }
      } else {
        // alert('Password must have more than 8 characters');
        openModal('Password must have more than 8 characters', 'danger');
      }
    }
  };

document.querySelector('#signup').addEventListener('click', signupFormHandler);



