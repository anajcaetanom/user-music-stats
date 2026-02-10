const { v4: uuidv4 } = require('uuid');

const spotifyClient = require('../clients/spotify.client')
const redis = require('../clients/redis.client')

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;


async function handleCallback(code) {

    if (!code) {
        throw new Error('Missing code.');
    }

    const tokenResponse = await spotifyClient.exchangeCodeForToken(
        code, clientId, clientSecret, redirectURI
    )

    const { access_token, refresh_token, expires_in } = tokenResponse.data

    const requestId = uuidv4();

    await redis.set(requestId, JSON.stringify({ access_token }), {
        EX: 300
    });

    return requestId;
}

async function fetchUserTopData(accessToken, type, time_range, limit) {
    if(!['artists', 'tracks'].includes(type)) {
        throw new Error("Type is invalid or missing.");
    }
}