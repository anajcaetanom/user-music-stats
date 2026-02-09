require('dotenv').config();
const express = require('express');

const router = express.Router();


///////////// Routes /////////////

router.get('/top-artists/:username', async (req, res) => {
    const username = req.params.username;
    const { limit = 10, period = '7day' } = req.query;

    const data = await getUserTopArtists(
        username,
        limit,
        period
    );

    res.json(data);
});

router.get('/top-albums/:username', async (req, res) => {
    const username = req.params.username;
    const { limit = 10, period } = req.query;

    const data =  await getUserTopAlbums(
        username,
        limit,
        period
    );

    res.json(data);
});

router.get('/top-tracks/:username', async (req, res) => {
    const username = req.params.username;
    const { limit = 10, period } = req.query;

    const data = await getUserTopTracks(
        username,
        limit,
        period
    );

    res.json(data);
});

router.get('/profile-pic/:username', async (req, res) => {
    const username = req.params.username;

    const imageUrl = await getUserProfilePic(username);

    if (!imageUrl) {
        return res.status(404).json({error: 'Profile image not found'});
    }

    res.json({ username, imageUrl });
})

module.exports = router;