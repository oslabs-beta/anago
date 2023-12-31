import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import StoreProvider from './context/stateStore';
import './assets/style.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
