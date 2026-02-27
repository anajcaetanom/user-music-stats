require('dotenv').config();

const spotifyService = require('../../src/services/spotify.service');
const spotifyClient = require('../../src/clients/spotify.client');
const redis = require('../../src/clients/redis.client');

jest.mock('../../src/clients/spotify.client');

// Mock do Redis
jest.mock('../../src/clients/redis.client', () => ({
    get: jest.fn(),
    set: jest.fn()
}));

describe('Spotify Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // handleCallback
    describe('handleCallback',  () => {
        it('should throw error if code is missing', async() => {
            await expect(spotifyService.handleCallback())
                .rejects
                .toThrow('Missing code.');
        });

        it('should call client, store token in redis, and return a UUID', async () => {
            spotifyClient.exchangeCodeForToken.mockResolvedValue({
                data: {
                    access_token: 'mock_access_token',
                    refresh_token: 'mock_refresh_token',
                    expires_in: 3600
                }
            });

            redis.set.mockResolvedValue('OK');

            const result = await spotifyService.handleCallback('valid_code');

            expect(spotifyClient.exchangeCodeForToken).toHaveBeenCalledWith(
                'valid_code',
                process.env.CLIENT_ID,
                process.env.CLIENT_SECRET,
                process.env.REDIRECT_URI
            );

            expect(redis.set).toHaveBeenCalled();
            expect(typeof result).toBe('string');
        });
    })

    // fetchUserTopData
    describe('fetchUserTopData', () => {
        it('should throw error if type is invalid', async () => {
            await expect(spotifyService.fetchUserTopData('token', 'invalid', 'short_term', 10))
                .rejects
                .toThrow('Type is invalid or missing.');
        });

        it('should throw error if time_range is missing', async () => {
            await expect(spotifyService.fetchUserTopData('token', 'artists', undefined, 10))
                .rejects
                .toThrow('Time range is missing.');
        });

        it('should call client with correct params', async () => {
            spotifyClient.getUserTopData.mockResolvedValue({
                items: ['Radiohead', 'The Strokes']
            });

            const result = await spotifyService.fetchUserTopData('token', 'artists', 'long_term', 5);

            expect(spotifyClient.getUserTopData).toHaveBeenCalledWith(
                'token', 'artists', 'long_term', 5
            );
            expect(result).toEqual({ items: ['Radiohead', 'The Strokes'] });
        });
    });

    // fetchUserName
    describe('fetchUserName', () => {
        it('should call client and return display_name', async () => {
            spotifyClient.getUserProfileData.mockResolvedValue({
                display_name: 'John Doe'
            });

            const result = await spotifyService.fetchUserName('mock_token');

            expect(spotifyClient.getUserProfileData).toHaveBeenCalledWith('mock_token');
            expect(result).toBe('John Doe');
        });
    });
})






















