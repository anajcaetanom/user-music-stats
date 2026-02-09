const spotifyClient = require('../clients/spotify.client')
const redis = require('../redisClient')
const { v4: uuidv4 } = require('uuid');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;

function generateAuthURL() {
    const scopes = ['user-top-read'];

    return authURL = 'https://accounts.spotify.com/authorize?' + 
    	new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectURI,
            scope: scopes.join(' '),
            response_type: 'code',
            show_dialog: 'true'
        }).toString();
}

async function handleCallback(code) {
    const { 
        access_token, 
        refresh_token, 
        expires_in 
    } = await spotifyClient.exchangeCodeForToken(code);

    const requestId = uuidv4();

    await redis.set(requestId, JSON.stringify({ access_token }), {
        EX: 300
    });

    return requestId;
}