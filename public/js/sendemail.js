
const confirmation = async (event) => {
    event.preventDefault();
    
    const email = document.querySelector('#email').value.trim();
    
    const response = await fetch(`/api/recovery`, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json',
        },
        
    });
    
    if (response.ok) {
        document.location.replace(`password`);
    } else {
        // alert(response.message || 'Confirmation Failed');
        openModal('Confirmation Failed', 'danger');

    }
}

document.querySelector('#confirm').addEventListener('click', confirmation);
