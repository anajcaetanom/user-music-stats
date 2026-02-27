const request = require('supertest');
const express = require('express');

const spotifyRoutes = require('../../src/routes/spotify.routes');
const spotifyService = require('../../src/services/spotify.service');
const redis = require('../../src/clients/redis.client');

jest.mock('../../src/services/spotify.service');
jest.mock('../../src/clients/redis.client', () => ({
    get: jest.fn(),
    set: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/spotify', spotifyRoutes);

describe('Spotify Controller + Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/spotify/auth', () => {
        it('should redirect to Spotify Auth URL', async () => {
            const res = await request(app).get('/api/spotify/auth');

            // 302 é o status HTTP para Redirecionamento
            expect(res.status).toBe(302);
            expect(res.header.location).toContain('spotify.com');
        });
    });

    describe('GET /api/spotify/callback', () => {
        it('should call handleCallback and redirect to frontend', async () => {
            spotifyService.handleCallback.mockResolvedValue('mocked-uuid-123');

            const res = await request(app)
                .get('/api/spotify/callback')
                .query({ code: 'auth_code' });

            expect(res.status).toBe(302);
            expect(spotifyService.handleCallback).toHaveBeenCalledWith('auth_code');
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
                items: [{ name: 'Radiohead' }]
            });

            const res = await request(app)
                .get('/api/spotify/top/artists')
                .query({ id: 'valid-uuid', time_range: 'short_term', limit: 5 });

            expect(res.status).toBe(200);
            expect(res.body.items[0].name).toBe('Radiohead');
            expect(spotifyService.fetchUserTopData).toHaveBeenCalledWith(
                'valid_token', 'artists', 'short_term', 5
            );
        });

        it('should return 400 if service throws a missing param error', async () => {
            redis.get.mockResolvedValue(JSON.stringify({ access_token: 'valid_token' }));

            // Simulando erro vindo do service
            spotifyService.fetchUserTopData.mockRejectedValue(
                new Error('Time range is missing.')
            );

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

            const res = await request(app)
                .get('/api/spotify/userName')
                .query({ id: 'valid-uuid' });

            expect(res.status).toBe(200);
            expect(res.body).toBe('Ana');
        });
    });
});