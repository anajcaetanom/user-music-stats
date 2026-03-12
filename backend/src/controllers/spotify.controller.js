require('dotenv').config();

const spotifyService = require('../services/spotify.service');
const e = require('express');

class SpotifyController {
    async login(req, res) {
        try {
            const { authURL, nonce, cookieOptions } = await spotifyService.startAuth();
            const cookieName = spotifyService.getOAuthNonceCookieName();
            res.cookie(cookieName, nonce, cookieOptions);
            res.redirect(authURL);
        } catch (error) {
            this.#handleError(res, error, 'login');
        }
    }

    async callback(req, res) {
        const cookieOptions = spotifyService.getOAuthCookieOptions();
        const cookieName = spotifyService.getOAuthNonceCookieName();
        try {
            const { code, state } = req.query;
            const nonce = req.cookies[cookieName];

            const requestId = await spotifyService.handleCallback(code, state, nonce);

            res.clearCookie(cookieName, cookieOptions);
            res.redirect(`${process.env.FRONTEND_URI}/?spotifyAuth=success&id=${requestId}`);
        } catch (error) {
            res.clearCookie(cookieName, cookieOptions);
            this.#handleError(res, error, 'callback');
        }
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
                limit,
            );
            res.json(data);
        } catch (error) {
            this.#handleError(res, error, 'listUserTopData');
        }
    }

    async listUserName(req, res) {
        try {
            const username = await spotifyService.fetchUserName(req.accessToken);
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

        if (
            error.message.toLowerCase().includes('invalid state') ||
            error.message.toLowerCase().includes('expired state') ||
            error.message.toLowerCase().includes('mismatch')
        ) {
            return res.status(401).send(error.message);
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
                details: error.response?.data || error.message,
            });
        }

        // Erro genérico do servidor
        res.status(500).send(`Internal error during ${action}.`);
    }
}

module.exports = new SpotifyController();
