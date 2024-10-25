// API URL
const apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const wordInfo = document.getElementById('word-info');

// Event Listeners
searchBtn.addEventListener('click', searchWord);
randomBtn.addEventListener('click', getRandomWord);

// Fetch word data
async function searchWord() {
    const word = searchInput.value.trim();
    if (word) {
        try {
            const response = await fetch(apiUrl + word);
            if (!response.ok) {
                throw new Error('Word not found');
            }
            const data = await response.json();
            displayResults(data[0]);
        } catch (error) {
            displayError(error.message);
        }
    }
}

// Display word information
function displayResults(data) {
    const word = data.word;
    const phonetics = data.phonetics.map(p => p.text).join(', ') || "N/A";

    const meaningsHTML = data.meanings.map(meaning => {
        const partOfSpeech = `<h4>${meaning.partOfSpeech}:</h4>`;
        const definitionsList = meaning.definitions.map(def => {
            let defHTML = `<p>${def.definition}</p>`;
            if (def.example) {
                defHTML += `<p><em>Example: ${def.example}</em></p>`;
            }
            return defHTML;
        }).join('');
        return `<div class="meaning-block">${partOfSpeech}${definitionsList}</div>`;
    }).join('');

    wordInfo.innerHTML = `
        <h2>${word}</h2>
        <p><strong>Phonetics:</strong> ${phonetics}</p>
        <div class="meanings-container">
            ${meaningsHTML}
        </div>
    `;
}

// Display an error message
function displayError(message) {
    wordInfo.innerHTML = `
        <h2>Error</h2>
        <p>${message}</p>
    `;
}

// Fetch a random word (simulating randomness by selecting a word from a list)
function getRandomWord() {
    const randomWords = ['apple', 'serendipity', 'lie', 'inspiration', 'horizon', 'persistence'];
    const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
    searchInput.value = randomWord;
    searchWord();
}
