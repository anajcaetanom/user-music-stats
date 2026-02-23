require('dotenv').config();

const spotifyService = require('../services/spotify.service');

class SpotifyController {
    async login(req, res) {
        const scopes = ['user-top-read'];

        const authURL = 'https://accounts.spotify.com/authorize?' + 
            new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                redirect_uri: process.env.REDIRECT_URI,
                scope: scopes.join(' '),
                response_type: 'code',
                show_dialog: 'true'
            }).toString();

        res.redirect(authURL);
    }

    async callback(req, res) {
        const { code } = req.query

        const requestId = spotifyService.handleCallback(code);

        res.redirect(`${process.env.FRONTEND_URI}/?spotifyAuth=success&id=${requestId}`);
    }

    async listUserTopData(req, res) {
        const { type } = req.params;
        const { time_range, limit: limitParam } = req.query;

        const limit = Math.min(50, Math.max(1, Number(limitParam) || 10));

        try {
            const data = await spotifyService.fetchUserTopData(
                req.accessToken, 
                type,
                time_range,
                limit
            );
            res.json(data);
        } catch (error) {
            this.#handleError(res, error, 'listUserTopData');
        }
    }

    async listUserName(req, res) {
        try {
            const username = await spotifyService.fetchUserName(req.accessToken)
            res.json(username);
        } catch (error) {
            this.#handleError(res, error, 'listUserName');
        }
    }


    #handleError(res, error, action) {
        console.error(`Erro em ${action}:`, error.response?.data || error.message);

        // Erro de validação de parâmetro (vindo do Service)
        if (error.message.toLowerCase().includes('missing')) {
            return res.status(400).send(error.message);
        }

        // Erro de expiração/sessão (caso o Service ou Client detectem algo)
        if (error.message.includes('token') || error.message.includes('Expired')) {
            return res.status(401).send('Session expired or invalid.');
        }

        // Erro de comunicação com a API do Spotify (Axios)
        if (error.isAxiosError) {
            const status = error.response?.status || 502;
            return res.status(status).json({
                error: 'Spotify API failure',
                details: error.response?.data || error.message
            });
        }

        // Erro genérico do servidor
        res.status(500).send(`Internal error during ${action}.`);
    }
}

module.exports = new SpotifyController();