const logout = async () => {
    const response = await fetch('/api/user/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      document.location.replace('/');
    } else {
      // alert(response.statusText);
      openModal(`${response.statusText}`, 'danger');

    }
  };
  
document.querySelector('#logout').addEventListener('click', logout);