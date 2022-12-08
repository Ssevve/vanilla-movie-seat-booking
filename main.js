const movieSelect = document.querySelector('select');
const ticketPriceDisplay = document.querySelector('.price');
const checkoutPriceDisplay = document.querySelector('.checkout-price');

const state = {};

setInitialState();

const movieData = {
  "theMenu": {
    "price": "10",
    "seats": {
      "taken": ['A1', 'C4']
    }
  },
  "spoilerAlert": {
    "price": "12",
    "seats": {
      "taken": ['D5']
    }
  },
  "devotion": {
    "price": "14",
    "seats": {
      "taken": []
    }
  },
  "violentNight": {
    "price": "8",
    "seats": {
      "taken": []
    }
  }
};

const movies = JSON.parse(localStorage.getItem('movieData'));

if (!localStorage.getItem('movieData')) localStorage.setItem('movieData', JSON.stringify(movieData));

movieSelect.addEventListener('change', (e) => {
  state.selectedMovie = movies[e.target.value];

  ticketPriceDisplay.textContent = `${state.selectedMovie.price}$`;

  resetSeats();
  updateCheckoutPriceDisplay();

  const takenSeats = state.selectedMovie.seats.taken;

  takenSeats.forEach((seat) => {
    document.querySelector(`[data-seat=${seat}]`).disabled = true;
  });
});

function resetSeats() {
  const seatCheckboxes =  document.querySelectorAll('.seat-checkbox');
  seatCheckboxes.forEach((checkbox) => {
    checkbox.disabled = false;
    checkbox.checked = false;
  });
  clearSelectedSeats();
}

document.querySelector('.seats').addEventListener('click', (e) => {
  if (!e.target.dataset.seat) return;
  
  const targetSeat = e.target.dataset.seat;

  if (!state.selectedSeats.includes(targetSeat)) state.selectedSeats.push(targetSeat);
  else state.selectedSeats.splice(state.selectedSeats.indexOf(targetSeat), 1);

  updateCheckoutPriceDisplay();
});

function clearSelectedSeats() {
  state.selectedSeats = [];
}

function setInitialState() {
  state.selectedMovie = undefined;
  clearSelectedSeats();

  movieSelect.value = '';
  resetSeats();
  updateTicketPriceDisplay();
  updateCheckoutPriceDisplay();
}

function calcCheckoutPrice() {
  return state.selectedSeats.length * state.selectedMovie?.price || 0;
}

function updateCheckoutPriceDisplay() {
  checkoutPriceDisplay.textContent = `${calcCheckoutPrice()}$`;
}

function updateTicketPriceDisplay() {
  ticketPriceDisplay.textContent = `${state.selectedMovie?.price || 0}$`;
}