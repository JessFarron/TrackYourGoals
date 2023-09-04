
const confirmation = async (event) => {
    event.preventDefault();
    
    const code = document.querySelector('#confirmation-code').value.trim();
    
    const response = await fetch(`/api/verification/${code}`, {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
            'Content-Type': 'application/json',
        },
        
    });
    
    if (response.ok) {
        document.location.replace(`login`);
    } else {
        // alert(response.message || 'Confirmation Failed');
        openModal('Confirmation Failed', 'danger');

    }
}

document.querySelector('#confirm').addEventListener('click', confirmation);
