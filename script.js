const apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const randomWordApiUrl = 'https://random-word-api.herokuapp.com/word?number=1'; // API to get a random word

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
                defHTML += `<p style="margin-bottom: 20px;"><em>Example:</em> ${def.example}</p>`;
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

// Fetch a random word from the Random Word API
async function getRandomWord() {
    try {
        const response = await fetch(randomWordApiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch a random word');
        }
        const randomWordArray = await response.json();
        const randomWord = randomWordArray[0]; // Get the first word from the response
        searchInput.value = randomWord;
        searchWord();
    } catch (error) {
        displayError(error.message);
    }
}
