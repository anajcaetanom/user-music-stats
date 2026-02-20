require('dotenv').config();
const axios = require('axios');


class LastfmClient {
    constructor() {
        this.LASTFM_API_KEY = process.env.LASTFM_API_KEY;
        this.baseUrl = 'https://ws.audioscrobbler.com/2.0/';
    }

    async #get(method, params) {
        const response = await axios.get(this.baseUrl, {
            params: {
                method: method,
                api_key: this.LASTFM_API_KEY,
                format: 'json',
                ...params
            }
        });

        return response.data;
    }

    async getUserTopArtists(
        username,
        limit = 10,
        period
    ) {

        const data = await this.#get(
            'user.getTopArtists',
            {
                user: username,
                limit: limit,
                period: period,
            }
        )

        return data.topartists.artist;
    }

    async getUserTopAlbums(
        username,
        limit = 10,
        period
    ) {

        const data = await this.#get(
            'user.getTopAlbums',
            {
                user: username,
                limit: limit,
                period: period,
            }
        )

        return data.topalbums.album;
    }

    async getUserTopTracks(
        username,
        limit = 10,
        period
    ) {

        const data = await this.#get(
            'user.getTopTracks',
            {
                user: username,
                limit: limit,
                period: period,
            }
        )

        return data.toptracks.track;
    }

    async getUserProfilePic(username) {

        const data = await this.#get(
            'user.getInfo',
            {
                user: username,
            }
        )

        const images = data.user?.image || [];
        const imageObj = [...images].reverse().find(img => img['#text']);

        return imageObj?.['#text'] || null;
    }
}


module.exports = new LastfmClient();