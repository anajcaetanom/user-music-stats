require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = 4000;

const app = express();

const spotifyRoutes = require('./spotify_server');
const lastfmRoutes = require('./lastfm_server');

app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
}));

app.use(express.json());

// Rotas Spotify
app.use('/api/spotify', spotifyRoutes);

// Rotas LastFM
app.use('/api/lastfm', lastfmRoutes);

// Rota raiz
app.get('/api', (req, res) => {
    res.send('API funcionando: Spotify + LastFM');
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});