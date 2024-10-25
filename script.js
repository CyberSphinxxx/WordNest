const apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const wordInfo = document.getElementById('word-info');

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
        // Part of speech (e.g., noun, verb)
        const partOfSpeech = `<h4>${meaning.partOfSpeech}:</h4>`;
        
        // Definitions with examples and additional details
        const definitionsList = meaning.definitions.map(def => {
            let defHTML = `<p><strong>Definition:</strong> ${def.definition}</p>`;
            
            // Add example if present
            if (def.example) {
                defHTML += `<p><em>Example:</em> ${def.example}</p>`;
            }
            
            // Add synonyms if present
            if (def.synonyms && def.synonyms.length > 0) {
                defHTML += `<p><strong>Synonyms:</strong> ${def.synonyms.join(', ')}</p>`;
            }
            
            // Add antonyms if present
            if (def.antonyms && def.antonyms.length > 0) {
                defHTML += `<p><strong>Antonyms:</strong> ${def.antonyms.join(', ')}</p>`;
            }

            return `<div class="definition-block">${defHTML}</div>`;
        }).join('');

        return `<div class="meaning-block">${partOfSpeech}${definitionsList}</div>`;
    }).join('');

    // Render the final HTML
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
