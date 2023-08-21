import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import StoreProvider from './context/stateStore.tsx';
import './assets/style.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
