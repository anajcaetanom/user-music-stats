const lastfmService = require('../services/lastfm.service');

class LastfmController {

    async listUserTopArtists(req, res) {
        try {
            const username = req.params.username;
            const { limit, period } = req.query;

            const data = await lastfmService.fetchUserTopArtists(
                username,
                limit,
                period
            );

            res.json(data);

        } catch (err) {
            this.#handleError(err, res, 'listUserTopArtists')
        }
    }

    async listUserTopAlbums(req, res) {
        try {
            const username = req.params.username;
            const { limit, period } = req.query;

            const data = await lastfmService.fetchUserTopAlbums(
                username,
                limit,
                period
            );

            res.json(data);

        } catch (err) {
            this.#handleError(err, res, 'listUserTopAlbums')
        }
    }

    async listUserTopTracks(req, res) {
        try {
            const username = req.params.username;
            const { limit, period } = req.query;

            const data = await lastfmService.fetchUserTopTracks(
                username,
                limit,
                period
            );

            res.json(data);

        } catch (err) {
            this.#handleError(err, res, 'listUserTopTracks')
        }
    }

    async listUserProfilePic(req, res) {
        try {
            const username = req.params.username;

            const data = await lastfmService.fetchUserProfilePic(
                username,
            );

            res.json(data);

        } catch (err) {
            this.#handleError(err, res, 'listUserProfilePic')
        }
    }

    #handleError(error, res, action) {
        console.error(`Erro em ${action}:`, error.response?.data || error.message);

        // Erro de validação de parâmetro (vindo do Service)
        if (error.message.toLowerCase().includes('missing')) {
            return res.status(400).send(error.message);
        }

        // Erro de recurso não encontrado (vindo do Service)
        if (error.message.toLowerCase().includes('not found')) {
            return res.status(404).send(error.message);
        }

        // Erro de comunicação com a API do LastFm (Axios)
        if (error.isAxiosError) {
            const status = error.response?.status || 502;
            return res.status(status).json({
                error: 'LastFM API failure',
                details: error.response?.data || error.message
            });
        }

        // Erro genérico do servidor
        res.status(500).send(`Internal error during ${action}.`);
    }
}



module.exports = new LastfmController();