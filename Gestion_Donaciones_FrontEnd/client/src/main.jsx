import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './AuthContext';
import './index.css';
import { HeroUIProvider } from '@heroui/react';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeroUIProvider>
    <BrowserRouter>
    <AuthProvider>
    <AppRoutes />
    </AuthProvider>
    </BrowserRouter>
    </HeroUIProvider>
  </React.StrictMode>
);
