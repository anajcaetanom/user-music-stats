const lastfmClient = require('../clients/lastfm.client');

class LastfmService {
    async fetchUserTopArtists(username, limit, period) {
        if (!username) throw new Error("Username is missing.");
        if (!period) throw new Error("Period is missing.");

        return lastfmClient.getUserTopArtists(
            username,
            Number(limit) || 10,
            period
        );
    }

    async fetchUserTopAlbums(username, limit, period) {
        if (!username) throw new Error("Username is missing.");
        if (!period) throw new Error("Period is missing.");

        return lastfmClient.getUserTopAlbums(
            username,
            Number(limit) || 10,
            period
        );
    }

    async fetchUserTopTracks(username, limit, period) {
        if (!username) throw new Error("Username is missing.");
        if (!period) throw new Error("Period is missing.");

        return lastfmClient.getUserTopTracks(
            username,
            Number(limit) || 10,
            period
        );
    }

    async fetchUserProfilePic(username) {
        if (!username) throw new Error("Username is missing.");

        const data = await lastfmClient.getUserProfileData(username);

        const images = data?.image || [];

        if (images.length === 0) {
            throw new Error('Profile image not found.');
        }

        const imageObj = [...images].reverse().find(img => img['#text']);

        return imageObj?.['#text'] || null;

    }
}



module.exports = new LastfmService();