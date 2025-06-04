require('dotenv').config();
const express = require('express');
const cors = require('cors');

const PORT = 4000;
const app = express();

const session = require('express-session')

const spotifyRoutes = require('./spotify_server');
const lastfmRoutes = require('./lastfm_server');

app.use(cors({
    origin: process.env.FRONTEND_URI,
}));

app.use(express.json());

// Rotas Spotify
app.use('/spotify', spotifyRoutes);

// Rotas LastFM
app.use('/lastfm', lastfmRoutes);

// Rota raiz
app.get('/', (req, res) => {
    res.send('API funcionando: Spotify + LastFM');
});

app.use(session({
    secret: 'shhh_nao_grita',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000
    }
}));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});