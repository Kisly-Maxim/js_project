let dialogOpened = false;

function openDialog() {
    if (dialogOpened) {
        return;
    }
    document.body.style.overflow = 'hidden';
    let dialog = document.createElement('div');
    document.body.append(dialog);
    dialog.innerHTML = `
    <div class="login-box-wrapper">
    <div class="login-box">
      <div class="x-button-wrapper">
        <button class="x-button" onclick="closeDialog()">
          <span></span><span></span><span></span><span></span>
          X
        </button>
      </div>
      <h2>Login</h2>
      <form action="https://fe.it-academy.by/TestForm.php" method="get">
        <div class="user-box">
          <input type="text" name="login" required>
          <label>Username</label>
        </div>
        <div class="user-box">
          <input type="password" name="password" required>
          <label>Password</label>
        </div>
        <div class="form__group" style="--i: 1">
          <div class="remember-me-wrapper">
            <input type="checkbox" checked id="berries_1" value="strawberries">
            <label for="berries_1">Remember me</label>
          </div>
          <a href="#">Forgot your password?</a>
        </div>
        <button type="submit"><span></span><span></span><span></span><span></span>
          Submit
        </button>
      </form>
    </div>
  </div>`;
    dialogOpened = true;
}

function closeDialog() {
    let dialog = document.querySelector('.login-box-wrapper');
    dialog.remove();
    dialogOpened = false;
    document.body.style.overflow = 'overlay';
}

const searchParams = new URLSearchParams(location.search);
const id = searchParams.get('id') || 'all';
const characterID = searchParams.get('character');

async function loadMovie(id) {
    const response = await fetch(`https://desfarik.github.io/star-wars/api/film/${id}.json`);
    const data = await response.json();
    return data;
}

async function loadAllMovies(id) {
    const movieItems = document.querySelector('.movie-items');
    const promises = loadMovie(id);
    let movieList = await Promise.resolve(promises);
    for (const movie of movieList) {
        const linkMovie = document.createElement('a');
        linkMovie.classList.add('movie-item');
        linkMovie.dataset.id = movie.id;
        linkMovie.href = `index.html?id=${movie.id}`;
        const movieCover = MOVIE_COVER.find((cover) => cover.id === movie.id);
        const html = `
        <button class="img-container">
        <img src="${movieCover.src}" class="movie-cover" alt="movie">
        <span class="movie-rating">★ ${movieCover.rating}</span> 
        </button>
        <div class="movie-info">
        <div class="movie-title"><span>${movie.title}. Episode: ${movie.episode_id}</span></div>
        <div class="movie-crawl">${movie.opening_crawl}</div>
        <div class="movie-created">Release date: ${movie.release_date}</div>
        <div class="movie-episode"><span>Episode: ${movie.episode_id}</span></div>
        </div>
    `;
        linkMovie.innerHTML = html;
        movieItems.append(linkMovie);
    }
    OnSortingItems();
    toggleTheme();
    OnChangeLayout();
}
loadAllMovies(id);

async function renderMovieAbout(id) {
    const movie = await loadMovie(id);
    const movieContainer = document.querySelector('.movies-container');
    const movieCover = MOVIE_COVER.find((cover) => cover.id === movie.id);
    const html = `
<div class="movie-about-wrapper">
    <div class="movie-header">
        <span>Star Wars: ${movie.title}. Episode ${movie.episode_id}</span>
    </div>
    <div class="about-movie">
        <img class="img-about" src="${movieCover.src}" alt="movieCover">
        <div class="movie-story-wrapper">
            <div class="movie-story">
                <h3>Story:</h3>
                <p>${movie.opening_crawl}</p>
            </div>
            <div class="director-producer-info">
                <p>Directed by: <span>${movie.director}</span></p>
                <p>Produced by: <span>${movie.producer}</span></p>
                <p>Release date: <span>${movie.release_date}</span></p>
                <p>Rating IMDb: <span>${movieCover.rating}</span></p>
            </div>
        </div>
    </div>
    <div class="characters">
        <span>Characters:</span>
        <div class="characters-container">
        </div>
        <div class="load-more-wrapper">
            <div class="loader">loading</div>
            <div class="load-more">
                <button id="loadMoreCharacters" onclick="loadMore()">
                    <span></span><span></span><span></span><span></span>
                    Load more
                </button>
            </div>
        </div>
    </div>
</div>
`;
    movieContainer.innerHTML = html;
    loadMore();
    toggleTheme();
}

renderMovieAbout(id);

async function loadCharacterInfo(id) {
    const response = await fetch(
        `https://desfarik.github.io/star-wars/api/people/${id}.json`
    );
    const data = await response.json();
    return data;
}

async function renderCharacterAbout(id) {
    const characterInfo = await loadCharacterInfo(id);
    const movieContainer = document.querySelector('.movies-container');
    const html = `
    <div class="character-about">
    <img class="character-image" src="${characterInfo.image}" alt="characterInfo">
    <div class="character-description">
      <div class="biographical-informations">Personal information:</div>
      <p class="character-name">Name: <span>${characterInfo.name}</span></p>
      <p class="character-homeworld">Homeworld: <span>${characterInfo.homeworld}</span></p>
      <p class="character-birth">Birth year: <span>${characterInfo.birth_year}</span></p>
      <div class="anthropometric-properties">Anthropometric properties:</div>
      <p class="character-species">Species: <span>${characterInfo.species}</span></p>
      <p class="character-gender">Gender: <span>${characterInfo.gender}</span></p>
      <p class="character-skin_color">Skin color: <span>${characterInfo.skin_color}</span></p>
      <p class="character-height">Height: <span>${characterInfo.height} centimeters</span></p>
      <p class="character-mass">Mass: <span>${characterInfo.mass} kilograms</span></p>
      <div class="load-more-wiki"> 
      <a href="${characterInfo.wiki}" target="_blank"><button>Detailed information</button></a>
      </div>
    </div>
  </div>
  <div class="character-films">
    <p>Films with the participation of ${characterInfo.name}</p>
    <div class="character-films-featuring"></div>
  </div>`;
    movieContainer.innerHTML = html;
    showCharactersFilmsLinks(id);
    toggleTheme();
}

renderCharacterAbout(characterID);

async function showCharactersFilmsLinks(id) {
    const characterFilms = document.querySelector('.character-films-featuring');
    const characterInfo = await loadCharacterInfo(id);
    let links = characterInfo.films;
    let movies = await Promise.all(links.map((link) => loadMovie(link)));    
    movies.forEach((movie) => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'featuring-movie';
        const imgContainer = document.createElement('div');
        imgContainer.className = 'featuring-container';
        const movieCover = MOVIE_COVER.find((cover) => cover.id === movie.id);
        imgContainer.innerHTML = ` 
        <img src="${movieCover.src}" class="featuring-movie-cover" alt="movie">         
        `;
        const movieInfo = document.createElement('div');
        movieInfo.className = 'featuring-movie-info';
        movieInfo.innerHTML = ` 
        <div class="featuring-movie-title">${movie.title}. Episode: ${movie.episode_id}</div>         
        `;

        movieDiv.addEventListener('click', () => {
            window.location.href = `index.html?id=${movie.id}`;
        });

        movieDiv.appendChild(imgContainer);
        movieDiv.appendChild(movieInfo);
        characterFilms.appendChild(movieDiv);
    });
}

async function loadCharacter(id) {
    const response = await fetch(
        `https://desfarik.github.io/star-wars/api/people/${id}.json`
    );
    const data = await response.json();
    return data;
}

let currentPage = 1;
const itemsOnPage = 10;

function loadMore() {
    const startIndex = (currentPage - 1) * itemsOnPage;
    const endIndex = currentPage * itemsOnPage;
    renderMovieCharacters(startIndex, endIndex, itemsOnPage);
    currentPage++;
}

async function renderMovieCharacters(startIndex, endIndex, itemsOnPage) {
    const loadMoreButton = document.querySelector('.load-more');
    const charactersContainer = document.querySelector('.characters-container');
    const promises = Array.from({ length: 87 }, (_, i) => loadCharacter(i + 1));
    const spinner = document.querySelector('.loader');
    spinner.classList.add('show');
    loadMoreButton.classList.add('hidden');
    let charactersList = await Promise.all(promises);
    let movie = await loadMovie(id);
    let final = charactersList
        .filter((character) => {
            return character.films.includes(`${movie.id}`);
        })
        .map((character) => {
            const characterLink = document.createElement('a');
            characterLink.classList.add('character-link');
            characterLink.setAttribute(
                'href',
                `index.html?character=${character.id}`
            );
            const html = `  
        <div class="character-link-cover">
        <img src="${character.image}" class="character-cover" alt="movie"> 
        </div>
        <div class="character-title"><span>${character.name}</span></div>`;
            characterLink.innerHTML = html;
            return characterLink;
        });

    final
        .slice(startIndex, endIndex)
        .forEach((character) => charactersContainer.append(character));
    spinner.classList.remove('show');
    loadMoreButton.classList.remove('hidden');

    if (currentPage > Math.ceil(final.length / itemsOnPage)) {
        loadMoreButton.classList.add('hidden');
    }
}

const select = document.querySelector('#sorting');
const toggleThemes = document.querySelector('#checkbox');
const changeLayout = document.querySelector('.layouts');
const favorites = document.querySelector('.favorites');

toggleThemes.checked = restore().themesChecked || false;
select.selectedIndex = restore().select || 0;
changeLayout.checked = restore().layoutChecked || false;

function OnSortingItems() {
    const movieItems = document.querySelector('.movie-items');
    const movieList = Array.from(document.querySelectorAll('.movie-item'));
    if (select.selectedIndex === 0) {
        movieList.sort((a, b) => {
            const movieEpisodeA = a
                .querySelector('.movie-episode span')
                .textContent.split(' ')
                .slice(-1);
            const movieEpisodeB = b
                .querySelector('.movie-episode span')
                .textContent.split(' ')
                .slice(-1);
            return movieEpisodeA - movieEpisodeB;
        });
    }
    if (select.selectedIndex === 1) {
        movieList.sort((a, b) => {
            const movieEpisodeA = a
                .querySelector('.movie-episode span')
                .textContent.split(' ')
                .slice(-1);
            const movieEpisodeB = b
                .querySelector('.movie-episode span')
                .textContent.split(' ')
                .slice(-1);
            return movieEpisodeB - movieEpisodeA;
        });
    }
    if (select.selectedIndex === 2) {
        movieList.sort((a, b) => {
            const releaseDateA = new Date(
                a.querySelector('.movie-created').textContent.split(' ').slice(-1)
            );
            const releaseDateB = new Date(
                b.querySelector('.movie-created').textContent.split(' ').slice(-1)
            );
            return releaseDateA - releaseDateB;
        });
    }
    if (select.selectedIndex === 3) {
        movieList.sort((a, b) => {
            const releaseDateA = new Date(
                a.querySelector('.movie-created').textContent.split(' ').slice(-1)
            );
            const releaseDateB = new Date(
                b.querySelector('.movie-created').textContent.split(' ').slice(-1)
            );
            return releaseDateB - releaseDateA;
        });
    }
    store(select.selectedIndex);
    // movieList.innerHTML = '';
    movieList.forEach((movie) => {
        movieItems.appendChild(movie);
    });
}

function OnChangeLayout() {
    const movieItem = document.querySelectorAll('.movie-item');
    const movieItems = document.querySelector('.movie-items');
    if (changeLayout.checked) {
        movieItems.classList.add('list');
        movieItem.forEach((item) => {
            item.classList.add('list-item');
        });
        store(changeLayout.checked);
    } else {
        movieItems.classList.remove('list');
        movieItem.forEach((item) => {
            item.classList.remove('list-item');
        });
        store(changeLayout.checked);
    }
}

const searchInput = document.querySelector('#search-input');
let searchTimeout;

searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchItems();
    }, 200);
});

async function searchItems() {
    const movieItems = document.querySelector('.movie-items');
    const phrase = searchInput.value.toLowerCase();
    movieItems.innerHTML = '';
    const movieList = await loadMovie(id);
    movieList
        .filter((movie) => {
            return (
                movie.title.toLowerCase().includes(phrase) ||
                movie.opening_crawl.toLowerCase().includes(phrase) ||
                movie.episode_id.toString().includes(phrase)
            );
        })
        .forEach((movie) => {
            const linkMovie = document.createElement('a');
            linkMovie.classList.add('movie-item');
            linkMovie.setAttribute('data-id', `${movie.id}`);
            linkMovie.setAttribute('href', `index.html?id=${movie.id}`);
            const movieCover = MOVIE_COVER.find((cover) => cover.id === movie.id);
            const html = ` 
        <div class="img-container"> 
          <img src="${movieCover.src}" class="movie-cover" alt="movie"> 
          <span class="movie-rating">★ ${movieCover.rating}</span>  
        </div> 
        <div class="movie-info"> 
          <div class="movie-title"><span>${movie.title}. Episode: ${movie.episode_id}</span></div> 
          <div class="movie-crawl"><span>${movie.opening_crawl}</span></div> 
          <div class="movie-created">Release date: ${movie.release_date}></div> 
          <div class="movie-episode"><span>Episode: ${movie.episode_id}</span></div> 
        </div>`;
            linkMovie.innerHTML = html;

            // Добавляем проверку наличия класса list у родительского элемента movieItems
            if (movieItems.classList.contains('list')) {
                linkMovie.classList.add('list-item');
            }
            movieItems.appendChild(linkMovie);
        });
}

function toggleTheme() {
    if (toggleThemes.checked) {
        document.body.classList.add('dark');
        store(toggleThemes.checked);
    } else {
        document.body.classList.remove('dark');
        store(toggleThemes.checked);
    }
}
toggleTheme();

toggleThemeButton.addEventListener('click', () => {
    toggleThemes.checked = !toggleThemes.checked;
    toggleTheme();
});

function store() {
    localStorage.setItem(
        'dataStorage',
        JSON.stringify({
            select: select.selectedIndex,
            themesChecked: toggleThemes.checked,
            layoutChecked: changeLayout.checked,
        })
    );
}

function restore() {
    return JSON.parse(localStorage.getItem('dataStorage'));
}
