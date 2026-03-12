const { createClient } = require('redis');

class RedisClient {
    constructor() {
        this.client = createClient();
        this.client.on('error', (err) => console.log('Redis Client Error', err));
    }

    async connect() {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    async disconnect() {
        this.client.destroy();
    }

    // Métodos delegados para manter a interface limpa
    async get(key) {
        return await this.client.get(key);
    }

    async set(key, value, options) {
        return await this.client.set(key, value, options);
    }

    async del(key) {
        return await this.client.del(key);
    }
}

module.exports = new RedisClient();
