import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import axios, { AxiosError } from 'axios';

// vi.hoisted roda ANTES dos imports, e o service lê o baseURL assim que é importado
vi.hoisted(() => {
    vi.stubEnv('VITE_PROXY_LASTFM_URL', '/api/lastfm');
});

import { fetchCategory, fetchProfilePic } from './lastFmService';

beforeEach(() => {
    // só o axios.get é falso; o resto (incluindo handleApiError) roda de verdade
    vi.spyOn(axios, 'get');
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('fetchCategory', () => {
    test.each([
        ['artists', '/api/lastfm/top-artists/fulano'],
        ['albums', '/api/lastfm/top-albums/fulano'],
        ['tracks', '/api/lastfm/top-tracks/fulano'],
    ])('categoria %s chama a URL %s', async (category, expectedUrl) => {
        axios.get.mockResolvedValue({ data: [] });

        await fetchCategory('fulano', category, '7day');

        expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
            params: { period: '7day', limit: 10 },
        });
    });

    test('devolve res.data', async () => {
        const data = [{ name: 'Radiohead', playcount: 10 }];
        axios.get.mockResolvedValue({ data });

        await expect(fetchCategory('fulano', 'artists', '1month')).resolves.toEqual(data);
    });

    test('categoria inválida lança erro e não chama a API', async () => {
        await expect(fetchCategory('fulano', 'podcasts', '7day')).rejects.toThrow(
            'Invalid category.',
        );
        expect(axios.get).not.toHaveBeenCalled();
    });

    test('erro 4xx/5xx vira "Erro da API: <status>"', async () => {
        axios.get.mockRejectedValue(
            new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, {}, { status: 404 }),
        );

        await expect(fetchCategory('fulano', 'artists', '7day')).rejects.toThrow(
            'Erro da API: 404',
        );
    });

    test('sem resposta do servidor', async () => {
        axios.get.mockRejectedValue(new AxiosError('fail', 'ERR_NETWORK', undefined, {}));

        await expect(fetchCategory('fulano', 'artists', '7day')).rejects.toThrow(
            'Sem resposta do servidor',
        );
    });

    test('codifica caracteres especiais do username na URL', async () => {
        axios.get.mockResolvedValue({ data: [] });

        await fetchCategory('a b/c?d', 'artists', '7day');

        expect(axios.get).toHaveBeenCalledWith(
            '/api/lastfm/top-artists/a%20b%2Fc%3Fd',
            expect.anything(),
        );
    });
});

describe('fetchProfilePic', () => {
    test('chama a URL certa e devolve res.data', async () => {
        axios.get.mockResolvedValue({ data: { url: 'foto.jpg' } });

        const result = await fetchProfilePic('fulano');

        expect(axios.get).toHaveBeenCalledWith('/api/lastfm/profile-pic/fulano');
        expect(result).toEqual({ url: 'foto.jpg' });
    });

    test('erro da API lança com a mensagem tratada', async () => {
        axios.get.mockRejectedValue(
            new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, {}, { status: 500 }),
        );

        await expect(fetchProfilePic('fulano')).rejects.toThrow('Erro da API: 500');
    });

    test('erro que não é do axios também lança (não é engolido)', async () => {
        axios.get.mockRejectedValue(new Error('algo inesperado'));

        await expect(fetchProfilePic('fulano')).rejects.toThrow('algo inesperado');
    });

    test('codifica caracteres especiais do username na URL', async () => {
        axios.get.mockResolvedValue({ data: {} });

        await fetchProfilePic('a b/c?d');

        expect(axios.get).toHaveBeenCalledWith('/api/lastfm/profile-pic/a%20b%2Fc%3Fd');
    });
});
