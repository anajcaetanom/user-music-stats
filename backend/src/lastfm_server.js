require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

const baseUrl = 'https://ws.audioscrobbler.com/2.0/';

////////// LastFM Requests //////////

async function getUserTopArtists(
    username,
    limit = 10,
    period
) {
    try {
        const response = await axios.get(baseUrl, {
            params: {
                method: 'user.getTopArtists',
                user: username,
                api_key: LASTFM_API_KEY,
                format: 'json',
                limit,
                period
            }
        });

        return response.data.topartists.artist;

    } catch (error) {
        console.error('error when trying to fetch top artists: ', error);
        return [];
    }
}

async function getUserTopAlbums(
    username,
    limit = 10,
    period 
) {
    try {
        const response = await axios(baseUrl, {
            params: {
                method: 'user.getTopAlbums',
                user: username,
                api_key: LASTFM_API_KEY,
                format: 'json',
                limit,
                period
            }
        });

        return response.data.topalbums.album;

    } catch (error) {
        console.error('error when trying to fetch top albums: ', error);
        return [];
    }
}

async function getUserTopTracks(
    username,
    limit = 10,
    period
) {
    try {
        const response = await axios.get(baseUrl, {
            params: {
                method: 'user.getTopTracks',
                user: username,
                api_key: LASTFM_API_KEY,
                format: 'json',
                limit,
                period
            }
        });

        return response.data.toptracks.track;

    } catch (error) {
        console.error('error when trying to fetch top tracks: ', error);
        return [];
    }
    
}

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

module.exports = router;