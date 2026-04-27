import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#0f1117',
            borderRadius: '12px',
            border: '1px solid #e8ebf4',
            fontSize: '14px',
            fontFamily: 'DM Sans, sans-serif',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
