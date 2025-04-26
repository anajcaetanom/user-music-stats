const express = require('express');
const cors = require('cors');
const LastFM = require('last-fm');

const app = express();
const port = 3000;

const lastfm = new LastFM('6afb6561ded89f457d4cfbba34329bae', { 
    userAgent: 'LastFmApp/1.0 (https://github.com/anajcaetanom/user-music-stats)'});

// Dropdown menu options
app.get('/api/chartOptions', (req, res) => {
    const chartOptions = [
        { value: 'artists', label: 'Top Artists' },
        { value: 'tracks', label: 'Top Tracks' },
        { value: 'albums', label: 'Top Albums' },
    ];
    res.json(chartOptions);
});

app.get('/api/timeOptions', (req, res) => {
    const timeOptions = [
        { value: '7days', label: 'Last Week' },
        { value: '1month', label: 'Last Month' },
        { value: '6months', label: 'Last 6 Months' },
        { value: '12months', label: 'Last Year' },
    ];
    res.json(timeOptions);
});