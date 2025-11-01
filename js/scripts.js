import { getHomeMovieData } from '../js/api/movies/movie-home.js';
import { getMoviePopular } from '../js/api/movies/movie-popular.js';
import { getMovieTrending } from '../js/api/movies/movie-trending.js';
import { getMovieSearch } from '../js/api/movies/movie-search.js';
import { getMovieSearchKeywords } from '../js/api/movies/movie-search-keywords.js';
import { getMovieTopRated } from '../js/api/movies/movie-top-rated.js';
import { getMovieUpcoming } from '../js/api/movies/movie-upcoming.js';
import { getMovieNowPlaying } from '../js/api/movies/movie-now-playing.js';

const navLinks = document.querySelectorAll('.nav-links a');

// Add click listener to each
navLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault(); // prevent default navigation (optional)

    const page = link.textContent.trim(); // e.g., "Home", "Movies", "Series"

    // Example actions:
    if (page === 'Home') {
      window.location.reload();
    } else if (page === 'Movies') {
      window.location.href = "movie-lists.html?type=movies";
    } else if (page === 'Series') {
      alert("Comming Soon");
    }
  });
});

const homeMovieData = await getHomeMovieData();
const popularMovieData = await getMoviePopular('1');
const trendingMovieData = await getMovieTrending("1");
const topRatedMovieData = await getMovieTopRated("1");
const upcomingMovieData = await getMovieUpcoming("1");
const nowPlayingMovieData = await getMovieNowPlaying("1");
const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
renderData();

function getImageSize() {
  const width = window.innerWidth;

  if (width <= 480) return "w342";       // Mobile
  if (width <= 1024) return "w500";      // Tablet
  return "w780";                         // Desktop
}

function renderData() {
  const movieRows = document.querySelectorAll(".movie-row");
  setHrefsClickListeners();
  renderHomeMovies(homeMovieData);
  renderPopularMovies(popularMovieData.results, movieRows);
  renderTrendingMovies(trendingMovieData.results, movieRows);
  renderTopRatedMovies(topRatedMovieData.results, movieRows);
  renderUpcomingMovies(upcomingMovieData.results, movieRows);
  renderNowPlayingMovies(nowPlayingMovieData.results, movieRows);
}

function setHrefsClickListeners() {
  const sections = document.querySelectorAll(".section");

  sections.forEach(section => {
    const title = section.querySelector("h3")?.textContent.trim().toLowerCase();
    const link = section.querySelector(".view-all");

    if (!link || !title) return;

    // Define mapping between section titles and TMDB endpoints
    const categoryMap = {
      "popular": "popular",
      "top rated": "top_rated",
      "trending": "trending",
      "upcoming": "upcoming",
      "now playing": "now_playing"
    };

    const type = categoryMap[title] || "popular";

    // Set href dynamically
    link.href = `movie-lists.html?type=${type}`;
  });
}

function renderHomeMovies(data) {
  // Implement rendering logic here
  const heroMovie = data;

  // Elements
  const heroSection = document.querySelector(".hero");
  const heroContent = heroSection.querySelector(".hero-content");
  const titleEl = heroContent.querySelector("h2");
  const tagsEl = heroContent.querySelector(".tags");
  const descEl = heroContent.querySelector("p");

  // Set background image
  heroSection.style.background = `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}) center/cover no-repeat`;

  // Set title
  titleEl.textContent = heroMovie.title;

  // Set description (overview)
  descEl.textContent = heroMovie.overview.length > 150
    ? heroMovie.overview.slice(0, 150) + "..."
    : heroMovie.overview;

  // Set tags (genres)
  // Note: genre IDs are numbers, map them to genre names
  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
  };

  // Clear existing tags
  tagsEl.innerHTML = "";

  // Only show first 3 genres if available
  heroMovie.genre_ids.slice(0, 3).forEach(id => {
    const span = document.createElement("span");
    span.textContent = genreMap[id] || "Other";
    tagsEl.appendChild(span);
  });

  document.querySelector(".btn-primary").addEventListener("click", event => {
    window.location.href = "watch.html?id=" + heroMovie.id;
  });
}

function renderPopularMovies(data, movieRows) {
  // Implement rendering logic here
  const popularMovieRow = movieRows[3];
  popularMovieRow.innerHTML = ""; // Clear existing content
  const size = getImageSize();

  data.forEach(movie => {
    const imgUrl = `${TMDB_BASE_URL}${size}${movie.poster_path}`;

    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.style.background = `url(${imgUrl}) center/cover no-repeat`;
    card.title = movie.title;
    card.innerHTML = `<div class="overlay">${movie.title}</div>`;

    setClickListener(card, movie.id);
    popularMovieRow.appendChild(card);
  });
}

function renderTrendingMovies(data, movieRows) {
  // Implement rendering logic here
  const trendingMovieRow = movieRows[1];
  trendingMovieRow.innerHTML = ""; // Clear existing content
  const size = getImageSize();

  data.forEach(movie => {
    const imgUrl = `${TMDB_BASE_URL}${size}${movie.poster_path}`;

    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.style.background = `url(${imgUrl}) center/cover no-repeat`;
    card.title = movie.title;
    card.innerHTML = `<div class="overlay">${movie.title}</div>`;

    setClickListener(card, movie.id);
    trendingMovieRow.appendChild(card);
  });
}

function renderTopRatedMovies(data, movieRows) {
  // Implement rendering logic here
  const topRatedRow = movieRows[0];
  topRatedRow.innerHTML = ""; // Clear existing content
  const size = getImageSize();

  data.forEach(movie => {
    const imgUrl = `${TMDB_BASE_URL}${size}${movie.poster_path}`;

    const card = document.createElement("div");
    card.classList.add("movie-card", "small");
    card.style.background = `url(${imgUrl}) center/cover no-repeat`;
    card.title = movie.title;
    card.innerHTML = `<div class="overlay">${movie.title}</div>`;

    setClickListener(card, movie.id);
    topRatedRow.appendChild(card);
  });
}

function renderUpcomingMovies(data, movieRows) {
  // Implement rendering logic here
  const upcomingMovieRow = movieRows[2];
  upcomingMovieRow.innerHTML = ""; // Clear existing content
  const size = getImageSize();

  data.forEach(movie => {
    const imgUrl = `${TMDB_BASE_URL}${size}${movie.poster_path}`;

    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.style.background = `url(${imgUrl}) center/cover no-repeat`;
    card.title = movie.title;
    card.innerHTML = `<div class="overlay">${movie.title}</div>`;

    setClickListener(card, movie.id);
    upcomingMovieRow.appendChild(card);
  });
}

function renderNowPlayingMovies(data, movieRows) {
  // Implement rendering logic here
  const nowPlayingMovieRow = movieRows[4];
  nowPlayingMovieRow.innerHTML = ""; // Clear existing content
  const size = getImageSize();

  data.forEach(movie => {
    const imgUrl = `${TMDB_BASE_URL}${size}${movie.poster_path}`;

    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.style.background = `url(${imgUrl}) center/cover no-repeat`;
    card.title = movie.title;
    card.innerHTML = `<div class="overlay">${movie.title}</div>`;

    setClickListener(card, movie.id);
    nowPlayingMovieRow.appendChild(card);
  });
}

function setClickListener(card, movieId) {
  card.addEventListener('click', () => {
    window.location.href = `watch.html?id=${movieId}`;
  });
}

const searchInput = document.getElementById("search-input");
searchInput.style.display = 'flex';
const suggestionsContainer = document.getElementById("search-suggestions");

let debounceTimer; // timer variable

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  if (query === "") {
    suggestionsContainer.style.display = "none";
    return;
  }
  clearTimeout(debounceTimer); // cancel previous timer

  // start a new timer
  debounceTimer = setTimeout(async () => {
    const query = searchInput.value.toLowerCase();
    suggestionsContainer.innerHTML = "";

    const movies = await getMovieSearchKeywords(query, "1");

    if (!movies.results || movies.results.length === 0) {
      suggestionsContainer.style.display = "none";
      return;
    }

    movies.results.forEach(movie => {
      const div = document.createElement("div");
      div.textContent = movie.name;
      div.addEventListener("click", () => {
        searchInput.value = movie.name;
        suggestionsContainer.style.display = "none";
      });
      suggestionsContainer.appendChild(div);
    });

    suggestionsContainer.style.display = "block";
  }, 1000); // wait 1000ms before executing
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
    suggestionsContainer.style.display = "none";
  }
});

document.querySelector(".search-bar button").addEventListener("click", event => {
  event.preventDefault();
  window.location.href = "movie-lists.html?type=search&query=" + searchInput.value.toLowerCase();
});

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    window.location.href = "movie-lists.html?type=search&query=" + searchInput.value.toLowerCase();
  }
});