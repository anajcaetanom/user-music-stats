const redis = require ('../clients/redis.client');

const validateSpotifySession = async (req, res, next) => {
    const id = req.query.id || req.params.id;

    if (!id) return res.status(400).send('Missing request ID.');

    try {
        const raw = await redis.get(id);
        if (!raw) return res.status(401).send('Expired or invalid token.');

        const session = JSON.parse(raw);
        req.accessToken = session.access_token;
        next();
    } catch (error) {
        res.status(500).send('Session validation error.');
    }
};

module.exports = { validateSpotifySession };