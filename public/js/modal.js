const modal = document.getElementById('alertModal');
const closeBtn = document.getElementById('closeAlert');
const alertContent = document.getElementById('alertContent');

function openModal(text, alertType) {
    modal.classList.add('is-active');
    alertContent.textContent = text;
    modal.classList.add(`is-${alertType}`);

    setTimeout(closeModal, 3000);
}

function closeModal() {
    modal.classList.remove('is-active');
    modal.classList.remove('is-danger');
    modal.classList.remove('is-info');
    modal.classList.remove('is-success');
}

// openModal('This is a danger alert!', 'danger');

closeBtn.addEventListener('click', closeModal);