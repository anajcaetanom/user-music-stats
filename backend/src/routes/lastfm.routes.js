const lastfmController = require('../controllers/lastfm.controller')
const express = require('express');

const router = express.Router();

router.get(
    '/top-artists/:username',
    (req, res) => lastfmController.listUserTopArtists(req, res)
);

router.get(
    '/top-albums/:username',
    (req, res) => lastfmController.listUserTopAlbums(req, res)
);

router.get(
    '/top-tracks/:username',
    (req, res) => lastfmController.listUserTopTracks(req, res)
);

router.get(
    '/profile-pic/:username',
    (req, res) => lastfmController.listUserProfilePic(req, res)
);

module.exports = router;