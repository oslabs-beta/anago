import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Routes/App';
import StoreProvider from './stateStore';
import './style.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
