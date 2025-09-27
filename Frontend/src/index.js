import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from "./context/UserContext"
import { WebSocketProvider } from './context/WebSocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <UserProvider>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </UserProvider>
    </React.StrictMode>
  </BrowserRouter>
)

reportWebVitals();
