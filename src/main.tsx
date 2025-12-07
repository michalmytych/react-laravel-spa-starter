import { Provider } from "react-redux";
import { store } from "./store/store";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RouteProvider } from '@/providers/route-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import App from '@/App';
import '@/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <RouteProvider>
          <ThemeProvider defaultTheme="dark">
            <App />
          </ThemeProvider>
        </RouteProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);