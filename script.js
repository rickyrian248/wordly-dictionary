const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const word = input.value.trim();

  if (!word) {
    showError("Please enter a word.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();
    displayResults(data[0]);
  } catch (error) {
    showError("Sorry, we couldn't find that word.");
  }
});

function displayResults(data) {
  errorMessage.classList.add("hidden");
  results.innerHTML = "";

  const meaning = data.meanings[0];
  const definition = meaning.definitions[0];

  const audioSrc =
    data.phonetics.find((p) => p.audio)?.audio || null;

  const synonyms =
    definition.synonyms?.length > 0
      ? definition.synonyms.join(", ")
      : "No synonyms available.";

  results.innerHTML = `
    <div class="result-card">
      <h2>${data.word}</h2>
      <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
      <p><strong>Definition:</strong> ${definition.definition}</p>
      <p><strong>Example:</strong> ${
        definition.example || "No example available."
      }</p>
      <p><strong>Synonyms:</strong> ${synonyms}</p>
      ${
        audioSrc
          ? `<audio controls src="${audioSrc}"></audio>`
          : "<p>No pronunciation audio available.</p>"
      }
    </div>
  `;
}

function showError(message) {
  results.innerHTML = "";
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}