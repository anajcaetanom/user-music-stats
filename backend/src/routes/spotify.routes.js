const express = require('express');
const spotifyController = require("../controllers/spotify.controller");
const { validateSpotifySession } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get(
    '/auth',
    (req, res) => spotifyController.login(req, res)
);

router.get(
    '/callback',
    (req, res) => spotifyController.callback(req, res)
);

// Rotas protegidas pelo Middleware
router.get(
    '/top/:type',
    validateSpotifySession,
    (req, res) => spotifyController.listUserTopData(req, res)
);

router.get(
    '/userName',
    validateSpotifySession,
    (req, res) => spotifyController.listUserName(req, res)
);

module.exports = router;
