const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

// Sicherheitseinstellungen
// app.use(helmet());
//app.use(helmet.contentSecurityPolicy({
//    directives: {
//        defaultSrc: ["'self'"],
//        scriptSrc: ["'self'"],
//        objectSrc: ["'none'"],
//        upgradeInsecureRequests: [],
//    },
//}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 100, // Limit von 100 Anfragen pro IP
    message: "Too many requests, please try again later."
});

// app.use(limiter);

app.use(express.static('public'));
app.use(express.json());

app.get('/presets', (req, res) => {
    fs.readFile('presets.json', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to load presets' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/search', (req, res) => {
    const { username, nsfw, printAll, preset } = req.body;

    // Eingabevalidierung
    if (!username || typeof username !== 'string' || username.match(/[^a-zA-Z0-9_-]/)) {
        return res.status(400).json({ error: 'Invalid username' });
    }

    let command = `sherlock ${username}`;

    if (nsfw) command += ' --nsfw';
    if (printAll) command += ' --print-all';
    if (preset && typeof preset === 'string' && preset.match(/^[a-zA-Z0-9_-]+$/)) {
        command += ` --site ${preset}`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        } else {
            const cleanOutput = stdout.replace(/\[\+\] |\[\*\] /g, '').replace(/(\[\])\s|\[\]/g, '').trim();
            res.json({ output: cleanOutput });
        }
    });
});

// Fehlerbehandlung
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Sherlock Web UI running at http://localhost:${port}`);
});
