const axios = require('axios');

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const baseUrl = 'https://ws.audioscrobbler.com/2.0/';


async function getUserTopArtists(
    username,
    limit = 10,
    period
) {

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

}

async function getUserTopAlbums(
    username,
    limit = 10,
    period 
) {

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
}

async function getUserTopTracks(
    username,
    limit = 10,
    period
) {

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
}

async function getUserProfilePic(username) {
    const response = await axios.get(baseUrl, {
        params: {
            method: 'user.getInfo',
            user: username,
            api_key: LASTFM_API_KEY,
            format: 'json'
        }
    });

    const images = response.data?.user?.image || [];
    const imageObj = [...images].reverse().find(img => img['#text']);

    return imageObj?.['#text'] || null;
}

module.exports = {
    getUserTopArtists,
    getUserTopAlbums,
    getUserTopTracks,
    getUserProfilePic
}