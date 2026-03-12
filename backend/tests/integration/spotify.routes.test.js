const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');

const spotifyRoutes = require('../../src/routes/spotify.routes');
const spotifyService = require('../../src/services/spotify.service');
const redis = require('../../src/clients/redis.client');

jest.mock('../../src/services/spotify.service');
jest.mock('../../src/clients/redis.client', () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/spotify', spotifyRoutes);

describe('Spotify Controller + Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        process.env.FRONTEND_URI = 'http://localhost:3000';

        spotifyService.getOAuthNonceCookieName.mockReturnValue('spotify_oauth_nonce');
        spotifyService.getOAuthCookieOptions.mockReturnValue({
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 300000,
        });
    });

    describe('GET /api/spotify/auth', () => {
        it('should redirect to Spotify Auth URL and set oauth nonce cookie', async () => {
            spotifyService.startAuth.mockResolvedValue({
                authURL: 'https://accounts.spotify.com/authorize?client_id=test&state=abc',
                nonce: 'nonce-123',
                cookieOptions: {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 300000,
                },
            });

            const res = await request(app).get('/api/spotify/auth');

            expect(res.status).toBe(302);
            expect(res.header.location).toContain('accounts.spotify.com');

            const setCookieHeader = res.headers['set-cookie'];
            expect(setCookieHeader).toBeDefined();
            expect(setCookieHeader[0]).toContain('spotify_oauth_nonce=nonce-123');

            expect(spotifyService.startAuth).toHaveBeenCalled();
            expect(spotifyService.getOAuthNonceCookieName).toHaveBeenCalled();
        });
    });

    describe('GET /api/spotify/callback', () => {
        it('should call handleCallback with code, state and nonce, then redirect to frontend', async () => {
            spotifyService.handleCallback.mockResolvedValue('mocked-uuid-123');

            const res = await request(app)
                .get('/api/spotify/callback')
                .query({ code: 'auth_code', state: 'state_123' })
                .set('Cookie', ['spotify_oauth_nonce=nonce_123']);

            expect(res.status).toBe(302);
            expect(res.header.location).toBe(
                'http://localhost:3000/?spotifyAuth=success&id=mocked-uuid-123',
            );

            expect(spotifyService.handleCallback).toHaveBeenCalledWith(
                'auth_code',
                'state_123',
                'nonce_123',
            );
        });

        it('should return 400 if state is missing', async () => {
            spotifyService.handleCallback.mockRejectedValue(new Error('Missing state.'));

            const res = await request(app)
                .get('/api/spotify/callback')
                .query({ code: 'auth_code' })
                .set('Cookie', ['spotify_oauth_nonce=nonce_123']);

            expect(res.status).toBe(400);
            expect(res.text).toBe('Missing state.');
        });

        it('should return 400 if oauth nonce is missing', async () => {
            spotifyService.handleCallback.mockRejectedValue(new Error('Missing oauth nonce.'));

            const res = await request(app)
                .get('/api/spotify/callback')
                .query({ code: 'auth_code', state: 'state_123' });

            expect(res.status).toBe(400);
            expect(res.text).toBe('Missing oauth nonce.');
        });

        it('should return 401 if state is invalid or expired', async () => {
            spotifyService.handleCallback.mockRejectedValue(
                new Error('Invalid state or expired state.'),
            );

            const res = await request(app)
                .get('/api/spotify/callback')
                .query({ code: 'auth_code', state: 'state_123' })
                .set('Cookie', ['spotify_oauth_nonce=nonce_123']);

            expect(res.status).toBe(401);
            expect(res.text).toBe('Invalid state or expired state.');
        });

        it('should return 401 if state/session mismatch happens', async () => {
            spotifyService.handleCallback.mockRejectedValue(new Error('State/session mismatch.'));

            const res = await request(app)
                .get('/api/spotify/callback')
                .query({ code: 'auth_code', state: 'state_123' })
                .set('Cookie', ['spotify_oauth_nonce=nonce_123']);

            expect(res.status).toBe(401);
            expect(res.text).toBe('State/session mismatch.');
        });
    });

    describe('GET /api/spotify/top/:type', () => {
        it('should return 401 if session ID is missing or expired in Redis', async () => {
            // Simulando o Redis retornando "null" (token expirado)
            redis.get.mockResolvedValue(null);

            const res = await request(app)
                .get('/api/spotify/top/artists')
                .query({ id: 'expired-uuid', time_range: 'short_term' });

            // Middleware de auth deve interceptar e retornar 401
            expect(res.status).toBe(401);
            expect(res.text).toBe('Expired or invalid token.');
        });

        it('should return 200 and data if session is valid', async () => {
            // Redis retorna o token mockado
            redis.get.mockResolvedValue(JSON.stringify({ access_token: 'valid_token' }));

            // Serviço retorna os artistas
            spotifyService.fetchUserTopData.mockResolvedValue({
                items: [{ name: 'Radiohead' }],
            });

            const res = await request(app)
                .get('/api/spotify/top/artists')
                .query({ id: 'valid-uuid', time_range: 'short_term', limit: 5 });

            expect(res.status).toBe(200);
            expect(res.body.items[0].name).toBe('Radiohead');
            expect(spotifyService.fetchUserTopData).toHaveBeenCalledWith(
                'valid_token',
                'artists',
                'short_term',
                5,
            );
        });

        it('should return 400 if service throws a missing param error', async () => {
            redis.get.mockResolvedValue(JSON.stringify({ access_token: 'valid_token' }));

            // Simulando erro vindo do service
            spotifyService.fetchUserTopData.mockRejectedValue(new Error('Time range is missing.'));

            const res = await request(app)
                .get('/api/spotify/top/artists')
                .query({ id: 'valid-uuid' });

            // Controller deve pegar o erro do service no #handleError e retornar 400
            expect(res.status).toBe(400);
            expect(res.text).toContain('missing');
        });
    });

    describe('GET /api/spotify/userName', () => {
        it('should return 200 and display name', async () => {
            redis.get.mockResolvedValue(JSON.stringify({ access_token: 'valid_token' }));
            spotifyService.fetchUserName.mockResolvedValue('Ana');

            const res = await request(app).get('/api/spotify/userName').query({ id: 'valid-uuid' });

            expect(res.status).toBe(200);
            expect(res.body).toBe('Ana');
        });
    });
});
