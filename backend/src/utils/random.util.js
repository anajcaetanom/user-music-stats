const { randomBytes } = require('crypto');

function generateRandomHex(size = 32) {
    return randomBytes(size).toString('hex');
}

module.exports = { generateRandomHex };
