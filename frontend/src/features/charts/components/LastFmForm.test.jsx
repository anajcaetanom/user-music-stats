import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';

import { LastFmForm } from './LastFMForm';
import { fetchCategory } from '../services/lastFmService';
import { DataProvider } from '../../../shared/context/DataContext';
import { UiProvider, useUi } from '../../../shared/context/UiContext';

// única borda: o service que fala com o backend
vi.mock('../services/lastFmService');

// componente auxiliar só para observar o estado do UiContext (que roda de verdade)
const UiSpy = () => {
  const { isLoading, showResults } = useUi();
  return (
    <>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="results">{String(showResults)}</span>
    </>
  );
};

function setup() {
  const setCharts = vi.fn();
  render(
    <UiProvider>
      <DataProvider>
        <LastFmForm setCharts={setCharts} />
        <UiSpy />
      </DataProvider>
    </UiProvider>,
  );
  return { setCharts };
}

async function fillForm() {
  await userEvent.type(screen.getByLabelText(/lastfm user/i), 'fulano');
  await userEvent.click(screen.getByLabelText(/last week/i));
  await userEvent.click(screen.getByLabelText(/top artists/i));
}

const getSubmit = () => screen.getByRole('button', { name: /submit/i });

beforeEach(() => {
  // o catch do componente usa console.error; silencia para não poluir a saída
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

describe('LastFmForm', () => {
  test('botão começa desabilitado', () => {
    setup();
    expect(getSubmit()).toBeDisabled();
  });

  test('botão só habilita com usuário, timespan e categoria preenchidos', async () => {
    setup();

    await userEvent.type(screen.getByLabelText(/lastfm user/i), 'fulano');
    expect(getSubmit()).toBeDisabled();

    await userEvent.click(screen.getByLabelText(/last week/i));
    expect(getSubmit()).toBeDisabled();

    await userEvent.click(screen.getByLabelText(/top artists/i));
    expect(getSubmit()).toBeEnabled();
  });

  test('digitar atualiza o campo de usuário', async () => {
    setup();
    const input = screen.getByLabelText(/lastfm user/i);

    await userEvent.type(input, 'fulano');

    expect(input).toHaveValue('fulano');
  });

  test('ao enviar, chama fetchCategory com (username, category, timespan)', async () => {
    fetchCategory.mockResolvedValue([]);
    setup();

    await fillForm();
    await userEvent.click(getSubmit());

    expect(fetchCategory).toHaveBeenCalledWith('fulano', 'artists', '7day');
  });

  test('com sucesso, entrega os dados e mostra os resultados', async () => {
    const data = [{ name: 'Radiohead', playcount: 10 }];
    fetchCategory.mockResolvedValue(data);
    const { setCharts } = setup();

    await fillForm();
    await userEvent.click(getSubmit());

    await waitFor(() => expect(setCharts).toHaveBeenCalledWith(data));
    expect(screen.getByTestId('results')).toHaveTextContent('true');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  test('se o service não devolver dados, não mostra resultados', async () => {
    fetchCategory.mockResolvedValue(undefined);
    const { setCharts } = setup();

    await fillForm();
    await userEvent.click(getSubmit());

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(setCharts).not.toHaveBeenCalled();
    expect(screen.getByTestId('results')).toHaveTextContent('false');
  });

  test('com erro, não entrega dados e libera o loading', async () => {
    fetchCategory.mockRejectedValue(new Error('Erro da API: 500'));
    const { setCharts } = setup();

    await fillForm();
    await userEvent.click(getSubmit());

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(setCharts).not.toHaveBeenCalled();
    expect(screen.getByTestId('results')).toHaveTextContent('false');
  });

  test('durante a requisição, o loading fica true', async () => {
    let resolve;
    fetchCategory.mockReturnValue(new Promise((r) => (resolve = r)));
    setup();

    await fillForm();
    await userEvent.click(getSubmit());

    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    resolve([]);
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
  });

  test('não mostra erro inicialmente', () => {
    setup();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('com erro, mostra a mensagem na tela', async () => {
    fetchCategory.mockRejectedValue(new Error('Erro da API: 500'));
    setup();

    await fillForm();
    await userEvent.click(getSubmit());

    expect(await screen.findByRole('alert')).toHaveTextContent('Erro da API: 500');
  });

  test('a mensagem de erro some ao enviar de novo com sucesso', async () => {
    fetchCategory.mockRejectedValueOnce(new Error('Erro da API: 500'));
    fetchCategory.mockResolvedValueOnce([{ name: 'Radiohead', playcount: 10 }]);
    setup();

    await fillForm();
    await userEvent.click(getSubmit());
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await userEvent.click(getSubmit());

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

});
