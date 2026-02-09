require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
const express = require('express');
const axios = require('axios');
const redis = require('./redisClient');

const router = express.Router();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;

// get code
router.get('/auth', (req, res) => {
    const scopes = ['user-top-read'];

    const authURL = 'https://accounts.spotify.com/authorize?' + 
    	new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectURI,
            scope: scopes.join(' '),
            response_type: 'code',
            show_dialog: 'true'
        }).toString();
    
    res.redirect(authURL);
});

// troca o code pelo access_token
router.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    if (!code) {
        return res.status(400).send('Missing code.');
    }

    try {
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
            },
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectURI,
            }).toString(),
        });

        const { access_token, refresh_token, expires_in } = tokenResponse.data
        
        const requestId = uuidv4();

        await redis.set(requestId, JSON.stringify({ access_token }), {
            EX: 300
        });

        res.redirect(`${process.env.FRONTEND_URI}/?spotifyAuth=success&id=${requestId}`);

    } catch (error) {
        console.error("Erro ao trocar o code por token do Spotify:");

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else if (error.request) {
            console.error("Sem resposta da API:", error.request);
        } else {
            console.error("Erro desconhecido:", error.message);
        }

        res.status(500).send('Error in code-token exchange.');
    }
});



router.get('/top/:type', async (req, res) => {
    const { type } = req.params;
    const { time_range, limit = 10, id } = req.query;

    if (!id) return res.status(400).send('Missing request ID.');

    if (!['artists', 'tracks'].includes(type)) {
        return res.status(400).send('Invalid type.');
    }

    try {
        const raw = await redis.get(id);
        if (!raw) {
            return res.status(401).send('Expired or invalid token.');
        }
        const { access_token  } = JSON.parse(raw);
        const data = await getUserTopData(access_token , type, time_range, limit);
        res.json(data);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send(`Error fetching top ${type}`);
    }
});



router.get('/userName', async (req, res) => {
    const {id} = req.query;
    if (!id) return res.status(400).send('Missing request ID.');

    try {
        const raw = await redis.get(id);
        if (!raw) {
            return res.status(401).send('Expired or invalid token.');
        }
        const { access_token  } = JSON.parse(raw);
        const data = await getUserName(access_token);
        res.json(data);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send(`Error fetching top ${type}`);
    }
})

router.get('/cleanRedis', async (req, res) => {
  try {
    await redis.flushAll();
    console.log('Redis limpo com sucesso!');
  } catch (err) {
    console.error('Erro ao limpar o Redis:', err);
  }
});

module.exports = router;
