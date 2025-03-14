let currentPokemonId = null;

document.addEventListener('DOMContentLoaded', () => {
  const MAX_POKEMONS = 151;
  const pokemonID = new URLSearchParams(window.location.search).get('id');
  const id = parseInt(pokemonID, 10);

  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = './index.html');
  }

  currentPokemonId = id;
  loadPokemon(id);
});

async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),

      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
    ]);

    const abilitiesWrapper = document.querySelector('.pokemon-detail-wrap .pokemon-detail.move');

    abilitiesWrapper.innerHTML = '';

    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon);
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector('.body3-fonts.pokemon-description').textContent = flavorText;

      const [leftArrow, rightArrow] = ['#leftArrow', '#rightArrow'].map((sel) => document.querySelector(sel));

      leftArrow.removeEventListener('click', navigatePokemon);
      rightArrow.removeEventListener('click', navigatePokemon);

      if (id !== 1) {
        leftArrow.addEventListener('click', () => {
          navigatePokemon(id - 1);
        });
      }
      if (id !== 151) {
        rightArrow.addEventListener('click', () => {
          navigatePokemon(id + 1);
        });
      }
    }

    window.history.pushState({}, '', `./detail.html?id=${id}`);

    return true;
  } catch (error) {
    console.error('An error occurred while fetching Pokemon data', error);
    return false;
  }
}

async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
}

const typeColors = {
  normal: '#A8A878',
  fire: '#f08030',
  water: '#6890f0',
  electric: '#f8d030',
  grass: '#78C850',
  ice: '#98d8d8',
  fighting: '#c03028',
  poison: '#a040a0',
  ground: '#e0c068',
  flying: '#a890f0',
  psychic: '#f85888',
  bug: '#a8b820',
  rock: '#b8a038',
  ghost: '#705898',
  dragon: '#7038f8',
  dark: '#705848',
  steel: '#b8b8d0',
  fairy: '#ee99ac',
};

function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(', ');
}

function setTypeBackgroundColor(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType];

  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`);
    return;
  }

  const detailMainElement = document.querySelector('.detail-main');
  setElementStyles([detailMainElement], 'backgroundColor', color);
  setElementStyles([detailMainElement], 'borderColor', color);

  setElementStyles(document.querySelectorAll('.power-wrapper > p'), 'backgroundColor', color);

  setElementStyles(document.querySelectorAll('.stats-wrap p.stats'), 'color', color);

  setElementStyles(document.querySelectorAll('.stats-wrap .progress-bar'), 'color', color);

  const rgbaColor = rgbaFromHex(color);
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::webkit-progress-bar {
    background-color: rgba(${rgbaColor}), 0.5;
    }
    .stats-wrap .progress-bar::webkit-progress-value {
    background-color: ${color};
    }
  `;
  document.head.appendChild(styleTag);
}
