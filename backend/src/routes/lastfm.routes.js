const lastfmController = require('../controllers/lastfm.controller')
const express = require('express');

const router = express.Router();

router.get(
    '/top-artists/:username',
    lastfmController.listUserTopArtists
);


router.get(
    '/top-albums/:username',
    lastfmController.listUserTopAlbums
);

router.get(
    '/top-tracks/:username',
    lastfmController.listUserTopTracks
);

router.get(
    '/profile-pic/:username',
    lastfmController.listUserProfilePic
);

module.exports = router;