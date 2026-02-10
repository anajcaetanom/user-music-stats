const lastfmService = require('../services/lastfm.service');

async function listUserTopArtists(req, res) {
    try {
        const username = req.params.username;
        const { limit, period } = req.query;

        const data = await lastfmService.fetchUserTopArtists(
            username,
            limit,
            period
        );

        res.json(data);

    } catch (err) {
        if (err.message === 'Username is missing' ||
            err.message === 'Period is missing') {
            return res.status(400).json({ error: err.message });
        }
        if (err.isAxiosError) {
            return res.status(502).json({
                error: 'External service failure'
            });
        }
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}

async function listUserTopAlbums(req, res) {
    try {
        const username = req.params.username;
        const { limit, period } = req.query;

        const data = await lastfmService.fetchUserTopAlbums(
            username,
            limit,
            period
        );

        res.json(data);

    } catch (err) {
        if (err.message === 'Username is missing' ||
            err.message === 'Period is missing') {
            return res.status(400).json({ error: err.message });
        }
        if (err.isAxiosError) {
            return res.status(502).json({
                error: 'External service failure'
            });
        }
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}

async function listUserTopTracks(req, res) {
    try {
        const username = req.params.username;
        const { limit, period } = req.query;

        const data = await lastfmService.fetchUserTopTracks(
            username,
            limit,
            period
        );

        res.json(data);

    } catch (err) {
        if (err.message === 'Username is missing' ||
            err.message === 'Period is missing') {
            return res.status(400).json({ error: err.message });
        }
        if (err.isAxiosError) {
            return res.status(502).json({
                error: 'External service failure'
            });
        }
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}

async function listUserProfilePic(req, res) {
    try {
        const username = req.params.username;

        const data = await lastfmService.fetchUserProfilePic(
            username,
        );

        res.json(data);

    } catch (err) {
        if (err.message === 'Username is missing') {
            return res.status(400).json({ error: err.message });
        }
        if (err.isAxiosError) {
            return res.status(502).json({
                error: 'External service failure'
            });
        }
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}

module.exports = {
    listUserTopArtists,
    listUserTopAlbums,
    listUserTopTracks,
    listUserProfilePic
}