'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");


const fetchGenres = async () => {
  const url = `${TMDB_BASE_URL}/genre/movie/list?api_key=0001e8d1b525eb3ff32b36a2e267a58b`;
  const response = await fetch(url);
  const data = await response.json();
  return data.genres;
};

const identifyGenres = (movie, genres) => {
  const genreNames = movie.genre_ids.map((genreId) => {
    const genre = genres.find((genre) => genre.id === genreId);
    return genre ? genre.name : "Unknown";
  });
  return genreNames;
};










// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  const genres = await fetchGenres();
  
  renderMovies(movies.results, genres);
  // renderMovies(movies.results);
  
  console.log(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "MDAwMWU4ZDFiNTI1ZWIzZmYzMmIzNmEyZTI2N2E1OGI"
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  console.log(movieRes);
  renderMovie(movieRes);
};



// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();

};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = async (movies, genres) => {



  // Get movie cards container div
  const movieCardsContainer = document.getElementById("movie-cards-container");
  
  // Shuffle function for the movies array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Shuffle the movies inside movies array
  const shuffledMovies = shuffleArray(movies);

  // Get the first five movies from the shuffled array (therefore the random movies)
  const randomMovies = shuffledMovies.slice(0, 5);
  for (let i=0; i<randomMovies.length; i++) {
    const movie = randomMovies[i];
  const movieRes = await fetchMovie(movie.id);
    

    // For each movie create card, poster image, details section including title and rating divs
    const card = document.createElement("div");
    card.classList.add(`movie-card`);
    card.id = `movie-card-${i}`;

    const posterContainer = document.createElement("div");
    posterContainer.classList.add("movie-card-hero");
    card.appendChild(posterContainer);

    const overlay = document.createElement("div");
    overlay.classList.add("movie-card-poster-overlay");
    posterContainer.appendChild(overlay);

    const poster = document.createElement("img");
    poster.src = PROFILE_BASE_URL + movie.poster_path;
    poster.alt = movie.title + " poster";
    poster.classList.add("movie-card-poster");
    poster.id = `movie-card-poster-${i}`;
    posterContainer.appendChild(poster);

    const cardContent = document.createElement("div");
    cardContent.classList.add("movie-card-content");
    cardContent.id = `movie-card-content-${i}`;

    const movieTitleContainer = document.createElement("div");
    movieTitleContainer.classList.add("movie-title-container");
    movieTitleContainer.id = `movie-title-container-${i}`;
    cardContent.appendChild(movieTitleContainer);


    const title = document.createElement("h3");
    title.classList.add("movie-card-title");
    title.id = `movie-card-title-${i}`;
    title.textContent = movie.title;
    movieTitleContainer.appendChild(title);

    const movieGenres = identifyGenres(movie, genres);
    console.log(movieGenres);
    const movieGenreContainer = document.createElement("div");
    movieGenreContainer.classList.add("movie-genre-container");
    for (let j=0; j<movieGenres.length; j++) {
      
      const movieGenre = document.createElement("div");
      movieGenre.classList.add("movie-genre-tag");
      movieGenre.classList.add(`movie-genre-tag-${i}`);
      movieGenre.id = `movie-genre-tag-${j}`;
      movieGenre.textContent = movieGenres[j];
      movieGenreContainer.appendChild(movieGenre);
      // console.log(movieGenres[j]);
    }
    movieTitleContainer.appendChild(movieGenreContainer);
    


    const cardOverview = document.createElement("div");
    cardOverview.classList.add("movie-card-overview");
    cardOverview.id = `movie-card-overview-${i}`;
    cardOverview.textContent = movie.overview;
    cardContent.appendChild(cardOverview);


    const duration = document.createElement("div");
    duration.classList.add("movie-card-duration");
    duration.id = `movie-card-duration-${i}`;
    duration.textContent = `${movieRes.runtime} mins.`;
    cardContent.appendChild(duration); 
    
    card.appendChild(cardContent);


    const rating = document.createElement("p");
    rating.classList.add("movie-card-rating");
    rating.id = `movie-card-rating-${i}`;
    rating.innerHTML =  `Rating: <span class="rating-num"> ${movie.vote_average}</span>`;
    card.appendChild(rating);


    let durationRatingContainer;

    window.addEventListener("resize", () => {

      if (window.innerWidth <= 640) {
        posterContainer.style.display = "flex";
      }

      if (window.innerWidth <= 768 && window.innerWidth > 640) {
        if (!durationRatingContainer) {
          durationRatingContainer = document.createElement("div");
          durationRatingContainer.classList.add("duration-rating-container");
          durationRatingContainer.appendChild(duration);
          durationRatingContainer.appendChild(rating);
        }
        if (duration.parentNode === cardContent) {
          cardContent.removeChild(duration);
        }
        if (rating.parentNode === card) {
          card.removeChild(rating);
        }
        cardContent.appendChild(durationRatingContainer);
        movieTitleContainer.style.backgroundImage = `url(${PROFILE_BASE_URL}${movie.poster_path})`;
        posterContainer.style.display = "none";
      }

      else {
        if (durationRatingContainer && durationRatingContainer.parentNode === cardContent) {
          cardContent.removeChild(durationRatingContainer);
          durationRatingContainer = null;
        }
        cardContent.appendChild(duration);
        card.appendChild(rating);
        movieTitleContainer.style.backgroundImage = "none";
        posterContainer.style.display = "flex";
        
      }

    })
   
 

    // Append each card to the movie cards container div
    movieCardsContainer.appendChild(card);
  }


  movies.map((movie) => {
   /*  const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv); */
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
    console.log(movie.runtime);
};

  document.addEventListener("DOMContentLoaded", autorun); 

