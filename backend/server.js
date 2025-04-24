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
        { value: 'Artists', label: 'Top Artists' },
        { value: 'Tracks', label: 'Top Tracks' },
        { value: 'Albums', label: 'Top Albums' },
    ];
    res.json(chartOptions);
});

app.get('/api/timeOptions', (req, res) => {
    const timeOptions = [
        { value: '7day', label: 'Last Week' },
        { value: '1month', label: 'Last Month' },
        { value: '6month', label: 'Last 6 Months' },
        { value: '12month', label: 'Last Year' },
        { value: 'overall', label: 'Overall' },
    ];
    res.json(timeOptions);
});