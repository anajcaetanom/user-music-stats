const lastfmClient = require('../clients/lastfm.client');

async function fetchUserTopArtists(username, limit, period) {
    if (!username) throw new Error("Username is missing.");
    if (!period) throw new Error("Period is missing.");
    
    return lastfmClient.getUserTopArtists(
        username,
        Number(limit) || 10,
        period
    );
}

async function fetchUserTopAlbums(username, limit, period) {
    if (!username) throw new Error("Username is missing.");
    if (!period) throw new Error("Period is missing.");

    return lastfmClient.getUserTopAlbums(
        username,
        Number(limit) || 10,
        period
    );
}

async function fetchUserTopTracks(username, limit, period) {
    if (!username) throw new Error("Username is missing.");
    if (!period) throw new Error("Period is missing.");

    return lastfmClient.getUserTopTracks(
        username,
        Number(limit) || 10,
        period
    );
}

async function fetchUserProfilePic(username) {
    if (!username) throw new Error("Username is missing.");

    const imageUrl = await lastfmClient.getUserProfilePic(username);

    if (!imageUrl) {
        throw new Error('Profile image not found');
    }

    return imageUrl;
}

module.exports = {
    fetchUserTopArtists,
    fetchUserTopAlbums,
    fetchUserTopTracks,
    fetchUserProfilePic
};