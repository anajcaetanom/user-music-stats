require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const spotifyRoutes = require('./routes/spotify.routes');
const lastfmRoutes = require('./routes/lastfm.routes');

app.use(
    cors({
        origin: process.env.FRONTEND_URI,
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

// Rotas Spotify
app.use('/api/spotify', spotifyRoutes);

// Rotas LastFM
app.use('/api/lastfm', lastfmRoutes);

// Rota raiz
app.get('/api', (req, res) => {
    res.send('API funcionando: Spotify + LastFM');
});

module.exports = app;
