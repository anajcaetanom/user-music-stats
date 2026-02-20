const { v4: uuidv4 } = require('uuid');

const spotifyClient = require('../clients/spotify.client')
const redis = require('../clients/redis.client')


class SpotifyService {
    
    async handleCallback(code) {

        if (!code) {
            throw new Error('Missing code.');
        }

        const tokenResponse = await spotifyClient.exchangeCodeForToken(
            code, 
            process.env.CLIENT_ID, 
            process.env.CLIENT_SECRET, 
            process.env.REDIRECT_URI
        );

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        const requestId = uuidv4();

        await redis.set(requestId, JSON.stringify({ access_token }), {
            EX: 300
        });

        return requestId;
    }

    async fetchUserTopData(accessToken, type, time_range, limit) {
        if (!['artists', 'tracks'].includes(type)) {
            throw new Error("Type is invalid or missing.");
        }
        if (!time_range) throw new Error("Time range is missing.");


        return await spotifyClient.getUserTopData(
            accessToken, type, time_range, limit
        );
    }

    async fetchUserName(accessToken) {
        const userProfileData = await spotifyClient.getUserProfileData(
            accessToken
        );

        return userProfileData.display_name;
    }
}

module.exports = new SpotifyService();


