const request = require('supertest');
const express = require('express');

const lastfmRoutes = require('../../src/routes/lastfm.routes');
const lastfmService = require('../../src/services/lastfm.service');

jest.mock('../../src/services/lastfm.service');

const app = express();
app.use(express.json());
app.use('/api/lastfm', lastfmRoutes);

describe('LastFM Controller + Router', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/lastfm/top-artists/:username', () => {

        it('should return 200 and artists list', async () => {
            lastfmService.fetchUserTopArtists.mockResolvedValue([
                { name: 'Radiohead' },
                { name: 'Muse' }
            ]);
        
            const res = await request(app)
                .get('/api/lastfm/top-artists/:ana')
                .query({ limit: 5, period: '7day' })

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].name).toBe('Radiohead');
        });

        it('should return 400 if period is missing', async () => {
            lastfmService.fetchUserTopArtists.mockRejectedValue(
                new Error('Period is missing.')
            );

            const res = await request(app)
                .get('/api/lastfm/top-artists/ana');

            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('GET /api/lastfm/top-albums/:username', () => {

        it('should return 200 and albums list', async () => {
            lastfmService.fetchUserTopAlbums.mockResolvedValue([
                { name: 'Dangerous Woman' }
            ]);

            const res = await request(app)
                .get('/api/lastfm/top-albums/ana')
                .query({ period: '7day' });

            expect(res.status).toBe(200);
            expect(res.body[0].name).toBe('Dangerous Woman');
        });
    });

    describe('GET /api/lastfm/profile-pic/:username', () => {

        it('should return profile image', async () => {
            lastfmService.fetchUserProfilePic.mockResolvedValue(
                'http://image.url/pic.png'
            );

            const res = await request(app)
                .get('/api/lastfm/profile-pic/ana');

            expect(res.status).toBe(200);
            expect(res.body).toBeDefined();
        });

        it('should return 404 if image not found', async () => {
            lastfmService.fetchUserProfilePic.mockRejectedValue(
                new Error('Profile image not found.')
            );

            const res = await request(app)
                .get('/api/lastfm/profile-pic/ana');

            expect(res.status).toBe(404);
        });
    });
});