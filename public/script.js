// Check for the user's preferred color scheme (light or dark)
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Function to update the theme based on the user's preference
function updateTheme() {
    // Set the data-theme attribute to 'dark' or 'light' based on the match
    document.documentElement.setAttribute(
        "data-theme",
        prefersDarkScheme.matches ? "dark" : "light"
    );
}

// Listen for changes in the user's color scheme preference and update the theme accordingly
prefersDarkScheme.addEventListener("change", updateTheme);

// Initial theme setup when the page is loaded
updateTheme();

let username = '';

// Add event listener for the search button click event
document.getElementById("search-btn").addEventListener("click", function() {
    // Get the username input and sanitize it by trimming whitespace
    username = document.getElementById("username").value.trim();

    // Validate the username to ensure it only contains letters, numbers, underscores, and hyphens
    if (!/^[a-zA-Z0-9._@-]+$/.test(username)) {
        alert("Invalid username format. Only letters, numbers, underscores, and hyphens are allowed.");
        return; // Exit if the username is invalid
    }

    // Retrieve checkbox and select input values
    const nsfw = document.getElementById("nsfw-checkbox").checked;
    const printAll = document.getElementById("print-all-checkbox").checked;
    const csv = document.getElementById("csv-checkbox").checked;
    const preset = document.getElementById("preset-select").value;

    // Get UI elements for button text, spinner, and results
    const searchBtnText = document.getElementById("search-btn-text");
    const searchSpinner = document.getElementById("search-spinner");
    const resultsContainer = document.getElementById("results-container");
    const resultsDiv = document.getElementById("results");

    // Hide the results container initially
    resultsContainer.classList.add("hidden");

    // Show loading spinner, hide the search button text, and clear any previous results
    searchBtnText.classList.add("hidden");
    searchSpinner.classList.remove("hidden");
    resultsDiv.innerHTML = '';

    // Send the search request to the server via POST
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // Send the username, nsfw, printAll, csv, and preset values in the request body
        body: JSON.stringify({ username, nsfw, printAll, csv, preset }),
    })
    .then(response => {
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        // Clear previous results
        resultsDiv.innerHTML = '';
        resultsContainer.classList.remove("hidden"); // Show the results container

        // Create an unordered list to display the search results
        const ul = document.createElement('ul');

        // Check if the data contains results
        if (data.results && data.results.length > 0) {
            // Iterate over the results and create list items with clickable links
            data.results.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.url; // Set the link's href attribute to the result URL
                a.textContent = item.siteName; // Set the link text to the site name
                a.innerHTML = a.textContent + "<span class=\"material-symbols-outlined\" style=\"vertical-align: middle; margin-left: 4px;\">link</span>"
                a.target = '_blank'; // Open the link in a new tab
                a.rel = 'noopener noreferrer'; // Security: prevent window.opener vulnerability

                li.appendChild(a); // Append the link to the list item
                ul.appendChild(li); // Append the list item to the unordered list
            });
        } else {
            // If no results were found, display a message
            const p = document.createElement('p');
            p.textContent = 'No results found.';
            resultsDiv.appendChild(p);
        }

        resultsDiv.appendChild(ul); // Append the list to the results div

        // If the CSV checkbox is selected and CSV data is available, trigger the download
        if (csv && data.csv) {
            const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `${username}_sherlock.csv`); // Set the download filename
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click(); // Simulate a click to download the file
            document.body.removeChild(link); // Remove the link element after downloading
        }
    })
    .catch((error) => {
        // Handle errors by displaying a message in the results div
        console.error('Error:', error);
        resultsDiv.textContent = 'An error occurred.';
        resultsContainer.classList.remove("hidden"); // Show the results container
    })
    .finally(() => {
        // Hide the spinner and show the search button text again
        searchSpinner.classList.add("hidden");
        searchBtnText.classList.remove("hidden");
    });
});
