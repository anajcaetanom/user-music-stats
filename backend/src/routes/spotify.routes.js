const express = require('express');
const spotifyController = require("../controllers/spotify.controller");
const { validateSpotifySession } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get('/auth', spotifyController.login);
router.get('/callback', spotifyController.callback);

// Rotas protegidas pelo Middleware
router.get('/top/:type', validateSpotifySession, spotifyController.listUserTopData);
router.get('/userName', validateSpotifySession, spotifyController.listUserName);

module.exports = router;
