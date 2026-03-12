import axios from 'axios';

export const handleApiError = (error) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // servidor respondeu com erro (4xx / 5xx)
            throw new Error(`Erro da API: ${error.response.status}`);
        }

        if (error.request) {
            // requisição foi feita mas não houve resposta
            throw new Error('Sem resposta do servidor');
        }

        // erro ao configurar a requisição
        throw new Error(`Erro na requisição: ${error.message}`);
    }
};
