const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const helmet = require('helmet');
const os = require('os');
const path = require('path');
const validator = require('validator');

const app = express();
const port = process.env.PORT || 3000;

// Use Helmet to set security-related HTTP headers
if (process.env.SECURITY === 'enabled') {
    app.use(helmet());
}

// Predefined presets mapping to specific categories of websites
const presets = {
    'social media': ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Reddit', 'YouTube', 'TikTok'],
    'nsfw': [
        "APClips",
        "AdmireMe.Vip",
        "All Things Worn",
        "BongaCams",
        "ChaturBate",
        "Erome",
        "Heavy-R",
        "Image Fap"
    ],
    'blog sites': ['WordPress', 'Blogger', 'Medium', 'Tumblr']
};

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse incoming JSON requests
app.use(express.json());

// Handle search requests from the front end
app.post('/search', (req, res) => {
    const { username, nsfw, printAll, csv, preset } = req.body;

    // Input validation for username
    if (!username || typeof username !== 'string' || !/^[a-zA-Z0-9._@-]+$/.test(username)) {
        return res.status(400).json({ error: 'Invalid username. Only letters, numbers, underscores, and hyphens are allowed.' });
    }

    // Sanitize the username to prevent shell injection
    let command = `sherlock ${validator.escape(username)}`;

    // Add options for NSFW or printing all results
    if (nsfw) command += ' --nsfw';
    if (printAll) command += ' --print-all';

    // Add preset sites if a valid preset is selected
    if (preset && typeof preset === 'string' && presets[preset]) {
        const sites = presets[preset];
        sites.forEach(site => {
            command += ` --site "${validator.escape(site)}"`;  // Escape site names to avoid shell injection
        });
    }

    let csvFilename = null;

    // If CSV download is requested, generate a temporary CSV filename
    if (csv) {
        csvFilename = path.join(os.tmpdir(), `sherlock_${username}_${Date.now()}.csv`);
        command += ` --csv --output "${csvFilename}"`;
    }

    // Execute the Sherlock command using child process
    exec(command, { shell: '/bin/bash' }, (error, stdout, stderr) => {
        if (error) {
            // If there is an error, send a 500 response with the error message
            return res.status(500).json({ error: stderr });
        } else {
            // Parse Sherlock's output to extract site names and URLs
            const lines = stdout.split('\n');
            const results = [];

            lines.forEach(line => {
                if (line.startsWith('[+]')) {
                    const content = line.substring(4).trim();
                    const colonIndex = content.indexOf(':');
                    if (colonIndex > -1) {
                        const siteName = content.substring(0, colonIndex).trim();
                        const url = content.substring(colonIndex + 1).trim();
                        results.push({ siteName, url });
                    }
                }
            });

            // If CSV is requested, read the generated CSV file and return it along with the results
            if (csv && csvFilename) {
                fs.readFile(csvFilename, 'utf8', (err, csvData) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to read CSV file' });
                    } else {
                        // Return the results and CSV data
                        res.json({ results, csv: csvData });

                        // Delete the temporary CSV file after sending the response
                        fs.unlink(csvFilename, (err) => {
                            if (err) console.error('Failed to delete CSV file:', err);
                        });
                    }
                });
            } else {
                // If no CSV is requested, just return the results
                res.json({ results });
            }
        }
    });
});

// Serve the Terms of Service page
app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

// Serve the Privacy Policy page
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Sherlock Web UI running at http://localhost:${port}`);
});
