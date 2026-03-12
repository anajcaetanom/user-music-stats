require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const { generateRandomHex } = require('../utils/random.util');
const spotifyClient = require('../clients/spotify.client');
const redis = require('../clients/redis.client');

const OAUTH_STATE_PREFIX = 'spotify_oauth_state:';
const OAUTH_NONCE_COOKIE = 'spotify_oauth_nonce:';
const OAUTH_TTL_SECONDS = 300;

class SpotifyService {
    getOAuthNonceCookieName() {
        return OAUTH_NONCE_COOKIE;
    }

    getOAuthCookieOptions() {
        const isProduction = process.env.NODE_ENV === 'production';

        return {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: OAUTH_TTL_SECONDS * 1000,
        };
    }

    async startAuth() {
        const scopes = ['user-top-read'];
        const state = generateRandomHex(32);
        const nonce = generateRandomHex(32);

        await redis.set(
            `${OAUTH_STATE_PREFIX}${state}`,
            JSON.stringify({
                nonce,
                purpose: 'spotify_auth',
                createdAt: Date.now(),
            }),
            { EX: OAUTH_TTL_SECONDS },
        );

        const authURL =
            'https://accounts.spotify.com/authorize?' +
            new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                redirect_uri: process.env.REDIRECT_URI,
                scope: scopes.join(' '),
                response_type: 'code',
                show_dialog: 'true',
                state,
            }).toString();

        return {
            authURL,
            nonce,
            cookieOptions: this.getOAuthCookieOptions(),
        };
    }

    async handleCallback(code, state, nonce) {
        if (!code) {
            throw new Error('Missing code.');
        }

        if (!state || typeof state !== 'string') {
            throw new Error('Missing state.');
        }

        if (!nonce || typeof nonce !== 'string') {
            throw new Error('Missing oauth nonce.');
        }

        const stateKey = `${OAUTH_STATE_PREFIX}${state}`;
        const storedStateRaw = await redis.get(stateKey);
        if (!storedStateRaw) {
            throw new Error('Invalid state or expired state.');
        }

        const storedState = JSON.parse(storedStateRaw);
        await redis.del(stateKey);

        if (storedState.nonce !== nonce) {
            throw new Error('State/session mismatch.');
        }

        const tokenResponseData = await spotifyClient.exchangeCodeForToken(
            code,
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI,
        );

        const { access_token, refresh_token, expires_in } = tokenResponseData;

        const requestId = uuidv4();

        await redis.set(
            requestId,
            JSON.stringify({
                access_token,
                refresh_token,
                expires_in,
            }),
            { EX: 300 },
        );

        return requestId;
    }

    async fetchUserTopData(accessToken, type, time_range, limit) {
        if (!['artists', 'tracks'].includes(type)) {
            throw new Error('Type is invalid or missing.');
        }
        if (!time_range) throw new Error('Time range is missing.');

        return await spotifyClient.getUserTopData(accessToken, type, time_range, limit);
    }

    async fetchUserName(accessToken) {
        const userProfileData = await spotifyClient.getUserProfileData(accessToken);

        return userProfileData.display_name;
    }
}

module.exports = new SpotifyService();
