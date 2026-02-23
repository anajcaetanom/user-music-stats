const lastfmService = require('../../src/services/lastfm.service');
const lastfmClient = require('../../src/clients/lastfm.client');

jest.mock('../../src/clients/lastfm.client');

describe('LastFM Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // fetchUserTopArtists
    describe('fetchUserTopArtists', () => {
        it('should throw error if username is missing', async () => {
            await expect(lastfmService.fetchUserTopArtists())
                .rejects
                .toThrow('Username is missing.');
        });

        it('should throw error if period is missing', async () => {
            await expect(lastfmService.fetchUserTopArtists('ana'))
                .rejects
                .toThrow('Period is missing.');
        });

        it('should call client with corret params', async () => {
            lastfmClient.getUserTopArtists.mockResolvedValue([
                'Ariana Grande',
                'Sabrina Carpenter'
            ])
            const result = await lastfmService.fetchUserTopArtists(
                'ana',
                2,
                '7day'
            )
            expect(lastfmClient.getUserTopArtists).toHaveBeenCalledWith(
                'ana',
                2,
                '7day'
            )
            expect(result).toEqual([
                'Ariana Grande',
                'Sabrina Carpenter'
            ])
        });

        it('should use default limit 10 if not provided', async () => {
            lastfmClient.getUserTopArtists.mockResolvedValue([
                'Daughter', 'London Grammar', 'The xx', 'Slowdive', 
                'Mazzy Star', 'Phoebe Bridgers', 'Beach House', 
                'Cigarettes After Sex', 'Low', 'Julien Baker', 
                'Ariana Grande', 'Sabrina Carpenter'
            ]);
            await lastfmService.fetchUserTopArtists(
                'ana',
                undefined,
                '7day'
            );
            expect(lastfmClient.getUserTopArtists).toHaveBeenCalledWith(
                'ana',
                10,
                '7day'
            );
        });
    });

    // fetchUserTopAlbums
    describe('fetchUserTopAlbums', () => {

        it('should throw error if username is missing', async () => {
            await expect(lastfmService.fetchUserTopAlbums())
                .rejects
                .toThrow('Username is missing.');
        });

        it('should throw error if period is missing', async () => {
            await expect(lastfmService.fetchUserTopAlbums('ana'))
                .rejects
                .toThrow('Period is missing.');
        });

        it('should call client with correct params', async () => {
            lastfmClient.getUserTopAlbums.mockResolvedValue([
                'Gal Costa (1969)', 'Elis & Tom', 
                'Marisa Monte (MM)', 'A Mulher do Fim do Mundo', 'Cores, Nomes'
            ]);

            const result = await lastfmService.fetchUserTopAlbums('ana', 5, '7day');

            expect(lastfmClient.getUserTopAlbums).toHaveBeenCalledWith('ana', 5, '7day');
            expect(result).toEqual([
                'Gal Costa (1969)', 'Elis & Tom', 
                'Marisa Monte (MM)', 'A Mulher do Fim do Mundo', 'Cores, Nomes'
            ]);
        });
    });

    // fetchUserTopTracks
    describe('fetchUserTopTracks', () => {

        it('should throw error if username is missing', async () => {
            await expect(lastfmService.fetchUserTopTracks())
                .rejects
                .toThrow('Username is missing.');
        });

        it('should throw error if period is missing', async () => {
            await expect(lastfmService.fetchUserTopTracks('ana'))
                .rejects
                .toThrow('Period is missing.');
        });

        it('should call client with correct params', async () => {
            lastfmClient.getUserTopTracks.mockResolvedValue([
                'Into You', 'God Is a Woman', 'No Tears Left to Cry', '7 rings', 'Dangerous Woman'
            ]);

            const result = await lastfmService.fetchUserTopTracks('ana', 5, '7day');

            expect(lastfmClient.getUserTopTracks).toHaveBeenCalledWith('ana', 5, '7day');
            expect(result).toEqual([
                'Into You', 'God Is a Woman', 'No Tears Left to Cry', '7 rings', 'Dangerous Woman'
            ]);
        });
    });

    // fetchUserProfilePic
    describe('fetchUserProfilePic', () => {

        it('should throw error if username is missing', async () => {
            await expect(lastfmService.fetchUserProfilePic())
                .rejects
                .toThrow('Username is missing.');
        });

        it('should throw error if client returns null', async () => {
            lastfmClient.getUserProfileData.mockResolvedValue(null);

            await expect(lastfmService.fetchUserProfilePic('ana'))
                .rejects
                .toThrow('Profile image not found');
        });

        it('should return image URL if client returns value', async () => {
            lastfmClient.getUserProfileData.mockResolvedValue({
                image: [{ '#text': 'http://image.url/img.png' }]
            });

            const result = await lastfmService.fetchUserProfilePic('ana');

            expect(result).toBe('http://image.url/img.png');
        });
    });
});