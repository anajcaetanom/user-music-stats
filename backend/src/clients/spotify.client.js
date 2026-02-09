const axios = require('axios');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;

async function exchangeCodeForToken(code) {
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

async function getUserTopData(accessToken, type, time_range, limit = 10) {
    const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
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

async function getUserName(accessToken) {
    const response = await axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`, 
        }
    });

    return response.data.display_name;
}

module.exports = {
    exchangeCodeForToken,
    getUserTopData,
    getUserName
}