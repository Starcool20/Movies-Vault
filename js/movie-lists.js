import { getMoviePopular } from '../js/api/movies/movie-popular.js';
import { getMovieTrending } from '../js/api/movies/movie-trending.js';
import { getMovieSearch } from '../js/api/movies/movie-search.js';
import { getMovieSearchKeywords } from '../js/api/movies/movie-search-keywords.js';
import { getMovieTopRated } from '../js/api/movies/movie-top-rated.js';
import { getMovieUpcoming } from '../js/api/movies/movie-upcoming.js';
import { getMovieNowPlaying } from '../js/api/movies/movie-now-playing.js';
import { getMovies } from './api/movies/movies.js';

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll('.nav-links a');
// Add click listener to each
navLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault(); // prevent default navigation (optional)

    const page = link.textContent.trim(); // e.g., "Home", "Movies", "Series"

    // Example actions:
    if (page === 'Home') {
      window.location.href = "index.html";
    } else if (page === 'Movies') {
      window.location.href = "movie-lists.html?type=movies";
    } else if (page === 'Series') {
      alert("Comming Soon");
    }
  });
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

const query = getQueryParam('type') || 'popular';
const searchValue = getQueryParam("query");
const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
let movieData = null;
let page = 1;

switch (query) {
  case 'popular':
    movieData = await getMoviePopular('1');
    break;
  case 'trending':
    movieData = await getMovieTrending('1');
    break;
  case 'top_rated':
    movieData = await getMovieTopRated('1');
    break;
  case 'upcoming':
    movieData = await getMovieUpcoming('1');
    break;
  case 'now_playing':
    movieData = await getMovieNowPlaying('1');
    break;
  case 'movies':
    movieData = await getMovies("1");
    break
  case 'search':
    movieData = await getMovieSearch(searchValue, "1");
    break
  default:
    movieData = await getMoviePopular('1');
    break;
}
const loadMorePill = document.querySelector(".load-more-pill");
if (!movieData.results || movieData.results.length < 20) {
  loadMorePill.style.display = "none";
}
function getImageSize() {
  const width = window.innerWidth;

  if (width <= 480) return "w342";       // Mobile
  if (width <= 1024) return "w500";      // Tablet
  return "w780";                         // Desktop
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
const size = getImageSize();
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
// Populate dynamically if needed
const movieContainer = document.querySelector(".movie-list");
movieContainer.innerHTML = movieData.results
  .map((m) => {
    // build genre string for each movie
    const genreData = m.genre_ids
      .slice(0, 3)
      .map((id) => genreMap[id] || "Other")
      .join(" • ");

    let overview = "";
    if (size < "w400") {
      overview = m.overview.slice(0, 60) + "...";
    } else {
      overview = m.overview.slice(0, 150) + "...";
    }

    return `
        <div class="movie-item">
          <img src="${TMDB_BASE_URL + size + m.poster_path}" alt="${m.title}" />
          <div class="movie-info">
            <h2>${m.title}</h2>
            <p class="meta">${genreData}</p>
            <p class="desc">${overview}</p>
            <button class="watch-btn" data-id="${m.id}">Watch Now</button>
          </div>
        </div>
      `;
  })
  .join("");

function setupWatchButtons() {
  const buttons = document.querySelectorAll(".watch-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const movieId = e.target.dataset.id;
      window.location.href = `watch.html?id=${movieId}`;
    });
  });
}
setupWatchButtons();
loadMorePill.addEventListener("click", async () => {
  // 1️⃣ Disable and add animation
  loadMorePill.disabled = true;
  loadMorePill.classList.add("loading");
  loadMorePill.innerHTML = "⏳ Loading...";
  page += 1;
  getNextMoviePage();
});
async function getNextMoviePage() {
  switch (query) {
    case 'popular':
      movieData = await getMoviePopular(page.toString());
      appendMovies(movieData);
      loadMorePill.disabled = false;
      loadMorePill.classList.remove("loading");
      loadMorePill.innerHTML = "⟳ Load More";
      break;
    case 'trending':
      movieData = await getMovieTrending(page.toString());
      appendMovies(movieData);
      loadMorePill.disabled = false;
      loadMorePill.classList.remove("loading");
      loadMorePill.innerHTML = "⟳ Load More";
      break;
    case 'top_rated':
      movieData = await getMovieTopRated(page.toString());
      appendMovies(movieData);
      loadMorePill.disabled = false;
      loadMorePill.classList.remove("loading");
      loadMorePill.innerHTML = "⟳ Load More";
      break;
    case 'upcoming':
      movieData = await getMovieUpcoming(page.toString());
      appendMovies(movieData);
      loadMorePill.disabled = false;
      loadMorePill.classList.remove("loading");
      loadMorePill.innerHTML = "⟳ Load More";
      break;
    case 'now_playing':
      movieData = await getMovieNowPlaying(page.toString());
      appendMovies(movieData);
      loadMorePill.disabled = false;
      loadMorePill.classList.remove("loading");
      loadMorePill.innerHTML = "⟳ Load More";
      break;
    case 'movies':
      movieData = await getMovieNowPlaying(page.toString());
      appendMovies(movieData);
      loadMorePill.disabled = false;
      loadMorePill.classList.remove("loading");
      loadMorePill.innerHTML = "⟳ Load More";
      break;
    case 'search':
      movieData = await getMovieSearch(searchValue, page.toString());
      appendMovies(movieData);
      loadMorePill.disabled = false;
      loadMorePill.classList.remove("loading");
      loadMorePill.innerHTML = "⟳ Load More";
      break
    default:
      movieData = await getMoviePopular(page.toString());
      appendMovies(movieData);
      loadMorePill.disabled = false;
      loadMorePill.classList.remove("loading");
      loadMorePill.innerHTML = "⟳ Load More";
      break;
  }
  if (!movieData.results || movieData.results.length < 20) {
    loadMorePill.style.display = "none";
  }
  setupWatchButtons();
}

function appendMovies(movieData) {
  const movieContainer = document.querySelector(".movie-list");

  movieData.results.forEach((m) => {
    // Build genre string for each movie
    const genreData = m.genre_ids
      .slice(0, 3)
      .map((id) => genreMap[id] || "Other")
      .join(" • ");

    // Shorten overview text depending on image size
    let overview = "";
    if (size === "w342") {
      overview = (m.overview || "").slice(0, 30) + "...";
    } else {
      overview = (m.overview || "").slice(0, 150) + "...";
    }

    // Create movie element
    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-item");
    movieItem.innerHTML = `
      <img src="${TMDB_BASE_URL + size + m.poster_path}" alt="${m.title}" />
      <div class="movie-info">
        <h2>${m.title}</h2>
        <p class="meta">${genreData}</p>
        <p class="desc">${overview}</p>
        <button class="watch-btn" data-id="${m.id}">Watch Now</button>
      </div>
    `;

    // Append instead of replacing
    movieContainer.appendChild(movieItem);
  });
}

const searchInput = document.getElementById("search-input");
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