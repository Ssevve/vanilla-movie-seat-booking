const movieSelect = document.querySelector('select');
const ticketPriceDisplay = document.querySelector('.price');
const checkoutPriceDisplay = document.querySelector('.checkout-price');
const seats = document.querySelector('.seats');
const checkoutBtn = document.querySelector('.checkout-btn');
const resetBtn = document.querySelector('.reset-btn');

const defaultMovieData = [
  {
    title: 'The Menu',
    price: '10',
    seats: {
      taken: ['A1', 'C4', 'C5', 'D8'],
    },
  },
  {
    title: 'Spoiler Alert',
    price: '12',
    seats: {
      taken: ['D5', 'E8', 'C4', 'C5' ,'A6', 'A5', 'A4',],
    },
  },
  {
    title: 'Devotion',
    price: '14',
    seats: {
      taken: ['E1', 'E2', 'E3', 'E5' ,'E8', 'E9', 'E10', 'E11', 'B5', 'B6', 'B7', 'B8'],
    },
  },
  {
    title: 'Violent Night',
    price: '8',
    seats: {
      taken: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'D6', 'D7'],
    },
  },
];

const state = {};

setInitialState();

resetBtn.addEventListener('click', resetStateToDefault);

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

function resetStateToDefault() {
  localStorage.setItem('movieData', JSON.stringify(defaultMovieData));
  setInitialState();
}

function setInitialState() {
  movieSelect.value = '';

  if (!localStorage.getItem('movieData'))
    localStorage.setItem('movieData', JSON.stringify(defaultMovieData));
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
