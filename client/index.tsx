import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Routes/App.tsx';
import StoreProvider from './stateStore.tsx';
import './style.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
);
