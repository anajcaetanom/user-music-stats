require('dotenv').config();
const express = require('express');
const axios = require('axios');

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

        req.session.accessToken = access_token;
        req.session.refreshToken = refresh_token;
        req.session.expiresIn = expires_in;

        // res.json({
        //     access_token,
        //     refresh_token,
        //     expires_in
        // });

        res.redirect(`${process.env.FRONTEND_URI}?spotifyAuth=success`)

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

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Couldnt logout.')
        }
        res.clearCookie('connect.sid');
        res.sendStatus(200);
    });
});

async function getUserTopData(accessToken, type, time_range, limit = 10) {
    const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`, 
        },
        params: {
            time_range,
            limit,
        }
    });

    return response.data
}

router.get('/top/:type', async (req, res) => {
    const accessToken = req.session.accessToken;
    console.log('Sessão:', req.session);
    if (!accessToken) {
        return res.status(401).send('Acesss token is missing.');
    }

    const { type } = req.params;
    const { time_range, limit = 10 } = req.query;

    if (!['artists', 'tracks'].includes(type)) {
        return res.status(400).send('Invalid type.');
    }

    try {
        const data = await getUserTopData(accessToken, type, time_range, limit);
        res.json(data);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send(`Error fetching top ${type}`);
    }
});

module.exports = router;
