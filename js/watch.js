import { getMovieDetails } from "./api/movies/movie-details.js";
import { getMovieDirectLinks } from "./api/movies/movie-direct-links.js";
import { getMovieRecommendation } from "./api/movies/movie-recommendation.js";
import { getMovieSearchKeywords } from "./api/movies/movie-search-keywords.js";
import { getMovieGenres } from "./api/movies/genres-lists.js";

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
    } else if (page === 'Genres') {
      openGenreModal();
    }
  });
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

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

const query = getQueryParam('id') || '';
const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
const movieDetails = await getMovieDetails(query);
const directLinks = await getMovieDirectLinks(query);
const recommendationsData = await getMovieRecommendation(query, 1);
const iframe = document.getElementById("player");
const genresData = await getMovieGenres();
document.title = movieDetails ? `${movieDetails.title} - Watch Now` : "Movie Not Found";

function getImageSize() {
  const width = window.innerWidth;

  if (width <= 480) return "w342";       // Mobile
  if (width <= 1024) return "w500";      // Tablet
  return "w780";                         // Desktop
}

populateMovieInfo(movieDetails);
populateRecommendations();
populateDirectLinks();

function populateMovieInfo(movie) {
  const section = document.querySelector(".movie-info");
  if (!section) return;

  // Elements inside
  const posterEl = section.querySelector(".poster img");
  const titleEl = section.querySelector(".details h1");
  const tagsEl = section.querySelector(".details .tags");
  const listEl = section.querySelector(".details ul");

  // 🖼️ Poster
  const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500";
  posterEl.src = TMDB_BASE_URL + "w500" + movie.poster_path;
  posterEl.alt = movie.title || movie.original_title;

  // 🎬 Title
  titleEl.textContent = movie.title || movie.original_title;

  // 🏷️ Tags (Genres)
  tagsEl.innerHTML = movie.genres
    .slice(0, 3)
    .map((g) => `<span>${g.name}</span>`)
    .join("");

    // 📅 Format release year
  const overview = movie.overview || "N/A";

  // 🕒 Format runtime (if available)
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "N/A";

  // 📅 Format release year
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  // 🌍 Country
  const country =
    movie.production_countries && movie.production_countries.length
      ? movie.production_countries.map((c) => c.name).join(", ")
      : "N/A";

  // 🏭 Production Companies
  const production =
    movie.production_companies && movie.production_companies.length
      ? movie.production_companies.map((p) => p.name).join(", ")
      : "N/A";

  // ⭐ Rating
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  // 📅 Release Date
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "N/A";

  // 🎭 Genres (full list)
  const fullGenres = movie.genres.map((g) => g.name).join(", ");

  // 👥 Cast — placeholder (since not in movie details response)
  // You can later fetch with /movie/{id}/credits for real cast
  const cast = "Tim Robbins, Rebecca Ferguson, Avi Nash, Rashida Jones, David Oyelowo";

  // 📝 Populate info list
  listEl.innerHTML = `
    <li><b>Overview:</b> ${overview}</li>
    <li><b>Year:</b> ${releaseYear}</li>
    <li><b>Runtime:</b> ${runtime}</li>
    <li><b>Rating:</b> ⭐ ${rating}</li>
    <li><b>Country:</b> ${country}</li>
    <li><b>Genre:</b> ${fullGenres}</li>
    <li><b>Release Date:</b> ${releaseDate}</li>
    <li><b>Production:</b> ${production}</li>
  `;

  // Optional: Show “Add to Favourites” if user is logged in
  const favBtn = section.querySelector(".fav-btn");
  if (favBtn) favBtn.style.display = "inline-block";
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function populateRecommendations() {
  // Populate cards
  const size = getImageSize();
  const grid = document.querySelector(".rec-grid");
  grid.innerHTML = "";
  recommendationsData.results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    const imgUrl = `${TMDB_BASE_URL}${size}${item.poster_path}`;
    img.src = imgUrl;
    img.alt = item.title;

    const title = document.createElement('p');
    title.textContent = item.title;

    setClickListener(card, item.id);
    card.appendChild(img);
    card.appendChild(title);
    grid.appendChild(card);
  });
}

function populateDirectLinks() {
  // Select container
  const container = document.querySelector('.direct-link-list');

  Object.entries(directLinks.data).forEach(([label, url], index) => {
    const btn = document.createElement('button');
    btn.textContent = label;

    // Click behavior
    btn.addEventListener('click', () => {
      document.querySelectorAll('.direct-link-list button')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    container.appendChild(btn);
  });
}

function setClickListener(card, movieId) {
  card.addEventListener('click', () => {
    window.location.href = `watch.html?id=${movieId}`;
  });
}

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

const modal = document.getElementById("genreModal");
const closeBtn = document.querySelector(".close");
const confirmBtn = document.getElementById("confirmGenre");
const genreSelect = document.getElementById("genres");

function openGenreModal() {
  modal.style.display = "block";
  populateGenreOptions();
}

function closeGenreModal() {
  modal.style.display = "none";
}

function populateGenreOptions() {
  const option = document.createElement("option");
  option.value = 0;
  option.textContent = "Select Genre";
  genreSelect.appendChild(option);
  genresData.genres.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

// Confirm selection
confirmBtn.addEventListener("click", () => {
  const selected = genreSelect.value;
  if (selected && selected != 0) {
    closeGenreModal();
    window.location.href = `movie-lists.html?type=genres&genre_id=${selected}`;
  }
});

closeBtn.addEventListener("click", () => {
  closeGenreModal();
});