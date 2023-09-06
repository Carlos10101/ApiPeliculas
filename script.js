const apiKey = 'a1ea6836ba26fc4ec22e1c9ddbd76628';
let currentPage = 1; 
const moviesPerPage = 10;

// Función para cargar géneros desde la API
async function loadGenres() {
    const genreSelect = document.getElementById('genre-select');
    genreSelect.innerHTML = '';
    const genreList = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${document.getElementById('language-select').value}&api_key=${apiKey}`);
    const genres = await genreList.json();

    genres.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.text = genre.name;
        genreSelect.appendChild(option);
    });
    genreSelect.addEventListener('change', loadMovies);
}

// Función para cargar películas populares desde la API
async function loadMovies() {
    const genreSelect = document.getElementById('genre-select');
    const selectedGenreIds = genreSelect.value;
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = ''; 

    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=${document.getElementById('language-select').value}&with_genres=${selectedGenreIds}&api_key=${apiKey}&page=${currentPage}`);
    const data = await response.json();

    data.results.slice(0, moviesPerPage).forEach(movie => { 
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
        `;
        movieList.appendChild(movieCard);
    });

    // Agregar botones de navegación
    const navigation = document.createElement('div');
    navigation.classList.add('navigation');
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.addEventListener('click', () => {
            currentPage--;
            loadMovies();
        });
        navigation.appendChild(prevButton);
    }
    if (currentPage < Math.ceil(data.results.length / moviesPerPage)) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.addEventListener('click', () => {
            currentPage++;
            loadMovies();
        });
        navigation.appendChild(nextButton);
    }
    movieList.appendChild(navigation);
}

// Función para cambiar de página hacia atrás
function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadMovies();
    }
}

// Función para cambiar de página hacia adelante
function goToNextPage() {
    currentPage++;
    loadMovies();
}

// Función para cambiar el idioma de la página
function changeLanguage() {
    // ...
}

// Carga los géneros al cargar la página
window.addEventListener('load', () => {
    loadGenres();

    // Agregar eventos a los botones de navegación
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.addEventListener('click', goToPreviousPage);
    nextButton.addEventListener('click', goToNextPage);

    // Llama a la función para cambiar el idioma cuando se selecciona un idioma diferente
    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', changeLanguage);
});