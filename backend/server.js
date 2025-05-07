require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

app.use(cors()); // Allow all origins (good for development)

app.post('/generate_chart', async (req, res) => {
    try {
        const { username, timespan, category } = req.body;
    }
})