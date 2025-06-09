require('dotenv').config();

const express = require('express');
const session = require('express-session')
const FileStore = require('session-file-store')(session);

const cors = require('cors');

const PORT = 4000;
const app = express();


const spotifyRoutes = require('./spotify_server');
const lastfmRoutes = require('./lastfm_server');

app.set('trust proxy', 1)

app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: new FileStore({
        path: './sessions',
        ttl: 1800,
        logFn: function() {}
    }),

    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000
    }
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