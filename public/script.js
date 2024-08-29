// Automatically switch between light and dark modes
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function updateTheme() {
    document.documentElement.setAttribute(
        "data-theme",
        prefersDarkScheme.matches ? "dark" : "light"
    );
}

prefersDarkScheme.addEventListener("change", updateTheme);

// Initial theme setup
updateTheme();

document.getElementById("search-btn").addEventListener("click", function() {
    const username = document.getElementById("username").value;
    const nsfw = document.getElementById("nsfw-checkbox").checked;
    const printAll = document.getElementById("print-all-checkbox").checked;
    const preset = document.getElementById("preset-select").value;

    const searchBtn = document.getElementById("search-btn");
    const searchBtnText = document.getElementById("search-btn-text");
    const searchSpinner = document.getElementById("search-spinner");
    const resultsContainer = document.getElementById("results-container");
    const resultsDiv = document.getElementById("results");

    // Show spinner, hide search text, and clear previous results
    searchBtnText.classList.add("hidden");
    searchSpinner.classList.remove("hidden");
    resultsDiv.textContent = '';

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, nsfw, printAll, preset }),
    })
    .then(response => response.json())
    .then(data => {
        resultsDiv.textContent = data.output;
        resultsContainer.classList.remove("hidden");
    })
    .catch((error) => {
        console.error('Error:', error);
        resultsDiv.textContent = 'An error occurred.';
        resultsContainer.classList.remove("hidden");
    })
    .finally(() => {
        // Hide spinner, show search text
        searchSpinner.classList.add("hidden");
        searchBtnText.classList.remove("hidden");
    });
});
