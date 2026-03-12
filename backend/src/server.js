require('dotenv').config();
const app = require('./app');
const redis = require('/clients/redis.client');

const PORT = 4000;

async function startServer() {
    await redis.connect();
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
});
