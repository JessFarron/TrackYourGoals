// Function to open the modal
function openModalEditGoal() {

  // Add is-active class on the modal
  document.getElementById("edit-goal").classList.add("is-active");
}

// Function to close the modal
function closeModalEditGoal() {
  document.getElementById("edit-goal").classList.remove("is-active");
}

// Function to open the modal
function openModalAddMoney() {

  // Add is-active class on the modal
  document.getElementById("add-money").classList.add("is-active");
}

// Function to close the modal
function closeModalAddMoney() {
  document.getElementById("add-money").classList.remove("is-active");
}

// Function to open the modal
function openModalRemoveMoney() {

  // Add is-active class on the modal
  document.getElementById("remove-money").classList.add("is-active");
}

// Function to close the modal
function closeModaRemoveMoney() {
  document.getElementById("remove-money").classList.remove("is-active");
}

// Add event listeners to close the modal
// whenever user click outside modal
document.querySelectorAll(
  ".modal-background"
).forEach(($el) => {
  const $modal = $el.closest(".modal");
  $el.addEventListener("click", () => {

    // Remove the is-active class from the modal
    $modal.classList.remove("is-active");
  });
});


const editHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#goal-page-goal').value.trim();
  const target_quantity = document.querySelector('#target-quantity').value.trim();
  const description = document.querySelector('#edit-description').value.trim();

  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];


  if (name && target_quantity && description) {
    const response = await fetch(`/api/objective/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, target_quantity, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // alert('Objective updated');
      const data = await response.json();
      if (data.message ==='Cannot use negative number as target amount') {
        openModal(`${data.message}`, 'danger');  
      } else {        
        openModal('Objective updated', 'success');
        document.location.replace(`/goal/${id}`);
      }
    } else {
      // alert(data.message || 'Failed to edit objective');
      openModal('Failed to edit objective', 'danger');
    }
  }
};

document.querySelector('#edit-submit-btn').addEventListener('click', editHandler);

// Create add money 

const addMoneyHandler = async (event) => {
  event.preventDefault();

  const quantity = document.querySelector('#add-quantity').value.trim();

    // Conditional to manage empty input from here (can be also solved from Models)
    if (quantity === '') {
      // alert('Please enter a value');
      openModal('Please enter a value', 'info');
      return;
    }

  const description = document.querySelector('#add-description').value.trim();
  
  console.log(description);

  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];


  const response = await fetch(`/api/transaction/${id}`, {
    method: 'POST',
    body: JSON.stringify({ quantity, description}),
    headers: {
      'Content-Type': 'application/json',
    },

  });


  if (response.ok) {
    // alert('Money added');
    openModal('Money added', 'success');
    document.location.replace(`/goal/${id}`);
  } else {
    // alert(response.message || 'Failed to add money');
    openModal('Failed to add money', 'danger');
  }
}


document.querySelector('#add-submit-btn').addEventListener('click', addMoneyHandler);


// Create Remove money

const removeMoneyHandler = async (event) => {
  event.preventDefault();

  const removeQuantity = document.querySelector('#remove-quantity');

  // Conditional to manage empty input from here (can be also solved from Models)
  if (removeQuantity.value.trim() === '') {
    // alert('Please enter a value');
    openModal('Please enter a value', 'info');
    return;
  }

  const negativeQuantity = parseFloat(removeQuantity.value.trim());
  const quantity = -1 * negativeQuantity;
  const description = document.querySelector('#remove-description').value.trim();

  console.log(description);

  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];


  const response = await fetch(`/api/transaction/${id}`, {
    method: 'POST',
    body: JSON.stringify({ quantity, description}),
    headers: {
      'Content-Type': 'application/json',
    },

  });


  if (response.ok) {
    // alert('Money removed');
    const data = await response.json();
      if (data.message ==='Cannot remove more than the remaining amount') {
        openModal(`${data.message}`, 'danger');  
      } else {                
        openModal('Money removed', 'success');
        document.location.replace(`/goal/${id}`);
      }
  } else {
    // alert(response.message || 'Failed to remove money');
    openModal('Failed to remove money', 'danger');
  }
}


document.querySelector('#remove-submit-btn').addEventListener('click', removeMoneyHandler);



// Create Delete Goal

const delButtonHandler = async (event) => {

  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  const response = await fetch(`/api/objective/${id}`, {
    method: 'DELETE',
  });


  if (response.ok) {
    // alert('Objective deleted');
    openModal('Objective deleted', 'success');
    document.location.replace('/profile');
  } else {
    const data = await response.json();
    // alert(data.message || 'Failed to delete objective');
    openModal('Failed to delete objective', 'danger');
  }
};

document.querySelector('#erase-goal').addEventListener('click', delButtonHandler);


// Chart display and functionallity
document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('transactionChart').getContext('2d');
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];
  fetch(`/transaction/goal/${id}`)
    .then(response => response.json())
    .then(data => {
      const transactions = data.transactions;
      const transactionQuantities = transactions.map(transaction => transaction.quantity);
      const transactionDates = transactions.map(transaction => new Date(transaction.date).toLocaleDateString());

      const barColors = transactionQuantities.map(value => value >= 0 ? '#70e08e' : '#f55d6c');

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: transactionDates,
          datasets: [{
            label: '',
            data: transactionQuantities,
            backgroundColor: barColors,
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              position: 'none'
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.dataset.data[context.dataIndex];
                  return '$' + value.toFixed(2);
                }
              }
            }
          },
          scales: {
            y: {
              ticks: {
                callback: function (value) {
                  return '$' + value.toFixed(2);
                }
              },
              grid: {
                display: true
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                display: false
              },
              drawBorder: false
            }
          },
        }
      });
    })
    .catch(error => {
      console.log(error);
    });
});

// PieChart
document.addEventListener('DOMContentLoaded', async function () {
  const ctx = document.getElementById('pieChart').getContext('2d');
  const goalId = window.location.toString().split('/').pop();

  try {
    const response = await fetch(`/transaction/goal/${goalId}`);
    const data = await response.json();

    const transactionTotal = data.transactionQuantities.reduce((total, quantity) => total + quantity, 0);
    const goalTotal = data.targetQuantity;
    const savingsPercentage = (transactionTotal / goalTotal) * 100;

    const savingsData = [transactionTotal, goalTotal - transactionTotal];

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [`Savings ${savingsPercentage.toFixed(2)}%`],
        datasets: [{
          data: savingsData,
          backgroundColor: ['#07b318', 'white'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.dataset.data[context.dataIndex];
                return '$' + value.toFixed(2);
              }

            }
          }
        }
      }
    });

  } catch (error) {
    console.log(error);
  }
});


