require('dotenv').config();

const spotifyService = require('../../src/services/spotify.service');
const spotifyClient = require('../../src/clients/spotify.client');
const redis = require('../../src/clients/redis.client');

const { generateRandomHex } = require('../../src/utils/random.util');

jest.mock('../../src/clients/spotify.client');

// Mock do Redis
jest.mock('../../src/clients/redis.client', () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
}));

jest.mock('../../src/utils/random.util', () => ({
    generateRandomHex: jest.fn(),
}));

describe('Spotify Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        process.env.CLIENT_ID = 'client-id';
        process.env.CLIENT_SECRET = 'client-secret';
        process.env.REDIRECT_URI = 'http://localhost:4000/api/spotify/callback';
        process.env.NODE_ENV = 'development';

        generateRandomHex.mockReturnValueOnce('mocked-state').mockReturnValueOnce('mocked-nonce');
    });

    describe('startAuth', () => {
        it('should generate auth url, nonce and persist state in redis', async () => {
            redis.set.mockResolvedValue('OK');

            const result = await spotifyService.startAuth();

            expect(result).toHaveProperty('authURL');
            expect(result).toHaveProperty('nonce');
            expect(result).toHaveProperty('cookieOptions');

            expect(result.authURL).toContain('https://accounts.spotify.com/authorize?');
            expect(result.authURL).toContain('client_id=client-id');
            expect(result.authURL).toContain('response_type=code');
            expect(result.authURL).toContain('state=');

            expect(redis.set).toHaveBeenCalledTimes(1);

            const [key, value, options] = redis.set.mock.calls[0];
            expect(key).toMatch(/^spotify_oauth_state:/);
            expect(options).toEqual({ EX: 300 });

            const parsed = JSON.parse(value);
            expect(parsed).toHaveProperty('nonce', result.nonce);
            expect(parsed).toHaveProperty('purpose', 'spotify_auth');
            expect(parsed).toHaveProperty('createdAt');
        });

        it('should return secure false in development', () => {
            process.env.NODE_ENV = 'development';

            const cookieOptions = spotifyService.getOAuthCookieOptions();

            expect(cookieOptions.secure).toBe(false);
            expect(cookieOptions.httpOnly).toBe(true);
            expect(cookieOptions.sameSite).toBe('lax');
            expect(cookieOptions.maxAge).toBe(300000);
        });

        it('should return secure true in production', () => {
            process.env.NODE_ENV = 'production';

            const cookieOptions = spotifyService.getOAuthCookieOptions();

            expect(cookieOptions.secure).toBe(true);
        });
    });

    describe('handleCallback', () => {
        it('should throw error if code is missing', async () => {
            await expect(spotifyService.handleCallback()).rejects.toThrow('Missing code.');
        });

        it('should throw error if state is missing', async () => {
            await expect(spotifyService.handleCallback('valid_code')).rejects.toThrow(
                'Missing state.',
            );
        });

        it('should throw error if nonce is missing', async () => {
            await expect(
                spotifyService.handleCallback('valid_code', 'valid_state'),
            ).rejects.toThrow('Missing oauth nonce.');
        });

        it('should throw error if state does not exist in redis', async () => {
            redis.get.mockResolvedValue(null);

            await expect(
                spotifyService.handleCallback('valid_code', 'valid_state', 'valid_nonce'),
            ).rejects.toThrow('Invalid state or expired state.');

            expect(redis.get).toHaveBeenCalledWith('spotify_oauth_state:valid_state');
        });

        it('should throw error if nonce does not match', async () => {
            redis.get.mockResolvedValue(JSON.stringify({ nonce: 'different_nonce' }));
            redis.del.mockResolvedValue(1);

            await expect(
                spotifyService.handleCallback('valid_code', 'valid_state', 'valid_nonce'),
            ).rejects.toThrow('State/session mismatch.');

            expect(redis.del).toHaveBeenCalledWith('spotify_oauth_state:valid_state');
        });

        it('should call client, delete state, store token in redis, and return a UUID', async () => {
            redis.get.mockResolvedValue(JSON.stringify({ nonce: 'valid_nonce' }));
            redis.del.mockResolvedValue(1);
            redis.set.mockResolvedValue('OK');

            spotifyClient.exchangeCodeForToken.mockResolvedValue({
                access_token: 'mock_access_token',
                refresh_token: 'mock_refresh_token',
                expires_in: 3600,
            });

            const result = await spotifyService.handleCallback(
                'valid_code',
                'valid_state',
                'valid_nonce',
            );

            expect(redis.get).toHaveBeenCalledWith('spotify_oauth_state:valid_state');
            expect(redis.del).toHaveBeenCalledWith('spotify_oauth_state:valid_state');

            expect(spotifyClient.exchangeCodeForToken).toHaveBeenCalledWith(
                'valid_code',
                process.env.CLIENT_ID,
                process.env.CLIENT_SECRET,
                process.env.REDIRECT_URI,
            );

            expect(redis.set).toHaveBeenCalledTimes(1);

            const [savedKey, savedValue, savedOptions] = redis.set.mock.calls[0];
            expect(typeof savedKey).toBe('string');
            expect(savedOptions).toEqual({ EX: 300 });

            const parsed = JSON.parse(savedValue);
            expect(parsed).toEqual({
                access_token: 'mock_access_token',
                refresh_token: 'mock_refresh_token',
                expires_in: 3600,
            });

            expect(typeof result).toBe('string');
        });
    });

    // fetchUserTopData
    describe('fetchUserTopData', () => {
        it('should throw error if type is invalid', async () => {
            await expect(
                spotifyService.fetchUserTopData('token', 'invalid', 'short_term', 10),
            ).rejects.toThrow('Type is invalid or missing.');
        });

        it('should throw error if time_range is missing', async () => {
            await expect(
                spotifyService.fetchUserTopData('token', 'artists', undefined, 10),
            ).rejects.toThrow('Time range is missing.');
        });

        it('should call client with correct params', async () => {
            spotifyClient.getUserTopData.mockResolvedValue({
                items: ['Radiohead', 'The Strokes'],
            });

            const result = await spotifyService.fetchUserTopData(
                'token',
                'artists',
                'long_term',
                5,
            );

            expect(spotifyClient.getUserTopData).toHaveBeenCalledWith(
                'token',
                'artists',
                'long_term',
                5,
            );
            expect(result).toEqual({ items: ['Radiohead', 'The Strokes'] });
        });
    });

    // fetchUserName
    describe('fetchUserName', () => {
        it('should call client and return display_name', async () => {
            spotifyClient.getUserProfileData.mockResolvedValue({
                display_name: 'John Doe',
            });

            const result = await spotifyService.fetchUserName('mock_token');

            expect(spotifyClient.getUserProfileData).toHaveBeenCalledWith('mock_token');
            expect(result).toBe('John Doe');
        });
    });
});
