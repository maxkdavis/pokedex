const MAX_POKEMON = 151;
const listWrapper = document.querySelector('.list-wrapper'); //<div> where all our pokemon list items will exist
const searchInput = document.querySelector('#search-input');
const numberFilter = document.querySelector('#number');
const nameFilter = document.querySelector('#name');
const notFoundMessage = document.querySelector('#not-found-message');

let allPokemons = []; // this is where we'll store data for each pokemon that comes from our API

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((res) => res.json())
  .then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
  });

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),

      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
    ]);
    return true;
  } catch (error) {
    console.error('Failed to fetch Pokemon data before redirect');
  }
}

function displayPokemons(pokemon) {
  listWrapper.innerHTML = ''; //clear HTML everytime we render

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split('/')[6];
    const listItem = document.createElement('div');
    listItem.className = 'list-item';
    listItem.innerHTML = `
      <div class="number-wrap">
         <p class="caption-fonts">#${pokemonID}</p>
      </div>
      <div class="img-wrap">
         <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
      </div>
        <div class="name-wrap">
         <p class="body3-fonts">#${pokemon.name}</p>
      </div>
    `;
    //if user clicks on an individual pokemon (the list item), redirect them to this other, details.html, page
    listItem.addEventListener('click', async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });

    listWrapper.appendChild(listItem);
  });
}

searchInput.addEventListener('keyup', handleSearch);

function handleSearch() {}
