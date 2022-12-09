const movieSelect = document.querySelector('select');
const ticketPriceDisplay = document.querySelector('.price');
const checkoutPriceDisplay = document.querySelector('.checkout-price');
const seats = document.querySelector('.seats');
const checkoutBtn = document.querySelector('.checkout-btn');

const movieData = [
  {
    title: 'The Menu',
    price: '10',
    seats: {
      taken: ['A1', 'C4'],
    },
  },
  {
    title: 'Spoiler Alert',
    price: '12',
    seats: {
      taken: ['D5'],
    },
  },
  {
    title: 'Devotion',
    price: '14',
    seats: {
      taken: [],
    },
  },
  {
    title: 'Violent Night',
    price: '8',
    seats: {
      taken: [],
    },
  },
];

const state = {};

setInitialState();

movieSelect.addEventListener('change', (e) => {
  state.selectedMovie = state.movies.find((movie) => movie.title === e.target.value);

  ticketPriceDisplay.textContent = `${state.selectedMovie.price}$`;

  resetSeats();
  updateCheckoutPriceDisplay();
});

seats.addEventListener('click', (e) => {
  if (!e.target.dataset.seat) return;

  if (!state.selectedMovie) {
    e.preventDefault();
    document.activeElement.blur();
  }

  const targetSeat = e.target.dataset.seat;

  if (!state.selectedSeats.includes(targetSeat)) state.selectedSeats.push(targetSeat);
  else state.selectedSeats.splice(state.selectedSeats.indexOf(targetSeat), 1);

  updateCheckoutPriceDisplay();
});

checkoutBtn.addEventListener('click', () => {
  if (!state.selectedSeats.length) return;

  const newTakenSeats = [...state.selectedMovie.seats.taken, ...state.selectedSeats];
  const newMovie = {
    ...state.selectedMovie,
    seats: {
      taken: newTakenSeats,
    },
  };

  const filteredMovies = state.movies.filter((movie) => movie.title !== state.selectedMovie.title);
  const newMovies = [...filteredMovies, newMovie];

  localStorage.setItem('movieData', JSON.stringify(newMovies));
  state.movies = JSON.parse(localStorage.getItem('movieData'));
  state.selectedMovie = state.movies.find((movie) => movie.title === newMovie.title);
  resetSeats();
  updateCheckoutPriceDisplay();
});

function resetSeats() {
  const seatCheckboxes = document.querySelectorAll('.seat-checkbox');
  seatCheckboxes.forEach((checkbox) => {
    checkbox.disabled = false;
    checkbox.checked = false;
  });

  clearSelectedSeats();

  const takenSeats = state.selectedMovie?.seats.taken;
  if (takenSeats) {
    takenSeats.forEach((seat) => {
      document.querySelector(`[data-seat=${seat}]`).disabled = true;
    });
  }
}

function clearSelectedSeats() {
  state.selectedSeats = [];
}

function setInitialState() {
  movieSelect.value = '';

  if (!localStorage.getItem('movieData'))
    localStorage.setItem('movieData', JSON.stringify(movieData));
  state.movies = JSON.parse(localStorage.getItem('movieData'));

  state.selectedMovie = undefined;

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

// TODO: Reset button to make all seats available
// TODO: Look up textContent, innerText etc.