import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';

import { LastFmCharts } from './LastFmCharts';
import { DataContext } from '../../../shared/context/DataContext';

const defaults = {
  username: 'fulano',
  timespan: '7day',
  category: 'artists',
  profilePic: '',
};

function renderCharts(charts, data = {}) {
  return render(
    <DataContext.Provider value={{ ...defaults, ...data }}>
      <LastFmCharts charts={charts} />
    </DataContext.Provider>,
  );
}

describe('LastFmCharts', () => {
  test('formata o username com a primeira letra maiúscula', () => {
    renderCharts([]);
    expect(screen.getByText('Fulano')).toBeInTheDocument();
  });

  test.each([
    ['7day', /last week/],
    ['1month', /last month/],
    ['6month', /last 6 months/],
    ['12month', /last year/],
  ])('timespan %s mostra o texto certo', (timespan, expected) => {
    renderCharts([], { timespan });
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  test('mostra a categoria na descrição', () => {
    renderCharts([], { category: 'albums' });
    expect(screen.getByText(/my top albums/)).toBeInTheDocument();
  });

  test('renderiza posição, nome e playcount de cada item', () => {
    renderCharts([
      { name: 'Radiohead', playcount: '10', mbid: 'a' },
      { name: 'Björk', playcount: '7', mbid: 'b' },
    ]);

    expect(screen.getByText('1. Radiohead')).toBeInTheDocument();
    expect(screen.getByText('Playcount: 10')).toBeInTheDocument();
    expect(screen.getByText('2. Björk')).toBeInTheDocument();
    expect(screen.getByText('Playcount: 7')).toBeInTheDocument();
  });

  test('mostra o artista quando a categoria não é artists', () => {
    renderCharts([{ name: 'Creep', playcount: '5', artist: { name: 'Radiohead' } }], {
      category: 'tracks',
    });
    expect(screen.getByText('Radiohead')).toBeInTheDocument();
  });

  test('não mostra o artista quando a categoria é artists', () => {
    renderCharts([{ name: 'Radiohead', playcount: '5', artist: { name: 'Thom' } }]);
    expect(screen.queryByText('Thom')).not.toBeInTheDocument();
  });

  test.each([[[]], [undefined]])('sem dados (%s) mostra "No charts available"', (charts) => {
    renderCharts(charts);
    expect(screen.getByText('No charts available')).toBeInTheDocument();
  });

  test('itens com mbid vazio e nomes repetidos não geram erro de key', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderCharts([
      { name: 'Mesmo', playcount: '1', mbid: '' },
      { name: 'Mesmo', playcount: '2', mbid: '' },
    ]);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
