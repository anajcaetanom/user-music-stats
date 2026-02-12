require('dotenv').config();

const axios = require('axios');

class SpotifyClient {
    constructor() {
        this.apiBaseUrl = 'https://api.spotify.com/v1/me';
    }

    async exchangeCodeForToken(code, clientId, clientSecret, redirectURI) {
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer
                    .from(
                        clientId + ':' + 
                        clientSecret)
                    .toString('base64'),
            },
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectURI,
            }).toString(),
        });

        return tokenResponse.data
    }

    async getUserTopData(accessToken, type, time_range, limit) {
        const response = await axios.get(`${this.apiBaseUrl}/top/${type}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`, 
            },
            params: {
                time_range,
                limit,
            }
        });

        return response.data
    }

    async getUserProfileData(accessToken) {
        const response = await axios.get(`${this.apiBaseUrl}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`, 
            }
        });

        return response.data;
    }

}




module.exports = new SpotifyClient();