import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './app/App';

import { UiProvider } from './shared/context/UiContext';
import { DataProvider } from './shared/context/DataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UiProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </UiProvider>
  </React.StrictMode>,
);
