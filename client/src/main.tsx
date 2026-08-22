import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MockDataProvider } from './context/MockDataContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <MockDataProvider>
        <App />
      </MockDataProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
