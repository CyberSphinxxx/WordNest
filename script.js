const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const randomWordButton = document.getElementById('random-word-button');
const resultsDiv = document.getElementById('results');
const historyDiv = document.getElementById('history');
const favoritesDiv = document.getElementById('favorites');
const wordOfTheDayDiv = document.getElementById('word-of-the-day');
const themeToggle = document.getElementById('theme-toggle');

let searchHistory = [];
let favorites = [];

// Toggle dark mode
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Search word on button click
searchButton.addEventListener('click', () => {
    const word = searchInput.value.trim();
    if (word) {
        fetchWord(word);
        addToHistory(word);
    }
});

// Fetch random word on button click
randomWordButton.addEventListener('click', () => {
    fetchRandomWord();
});

// Fetch a word's data from the API
function fetchWord(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) throw new Error('Word not found');
            return response.json();
        })
        .then(data => {
            displayResults(data[0]);
        })
        .catch(error => {
            resultsDiv.innerHTML = `<p>${error.message}</p>`;
        });
}

// Display a random word from a predefined list
function fetchRandomWord() {
    const randomWords = ['apple', 'banana', 'cherry', 'date', 'elderberry']; // Example words
    const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
    fetchWord(randomWord);
}

// Display word data in resultsDiv
function displayResults(data) {
    const word = data.word;
    const phonetics = data.phonetics.map(p => p.text).join(', ');
    const definitions = data.meanings.map(meaning => {
        return `<p><strong>${meaning.partOfSpeech}:</strong> ${meaning.definitions[0].definition}</p>`;
    }).join('');
    const examples = data.meanings.map(meaning => {
        return meaning.definitions[0].example ? `<p><em>Example: ${meaning.definitions[0].example}</em></p>` : '';
    }).join('');
    
    resultsDiv.innerHTML = `
        <h2>${word} <button onclick="toggleFavorite('${word}')">⭐</button></h2>
        <p>Phonetics: ${phonetics}</p>
        ${definitions}
        ${examples}
    `;
}

// Add word to history if not already present
function addToHistory(word) {
    if (!searchHistory.includes(word)) {
        searchHistory.push(word);
        displayHistory();
    }
}

// Display search history in historyDiv
function displayHistory() {
    historyDiv.innerHTML = searchHistory.map(word => `<p>${word}</p>`).join('');
}

// Toggle favorite status of a word
function toggleFavorite(word) {
    if (favorites.includes(word)) {
        favorites = favorites.filter(fav => fav !== word);
    } else {
        favorites.push(word);
    }
    displayFavorites();
}

// Display favorites in favoritesDiv
function displayFavorites() {
    favoritesDiv.innerHTML = favorites.map(word => `<p>${word}</p>`).join('');
}

// Set a word of the day
function setWordOfTheDay() {
    const todayWord = 'example'; // Could implement API or random word generator here
    fetchWord(todayWord);
}

// Initialize the word of the day on page load
setWordOfTheDay();
