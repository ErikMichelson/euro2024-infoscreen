import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import './global-styles/tailwind.css'
import './global-styles/background.css'

const rootElement = document.getElementById('app')
if (!rootElement) {
  throw new Error('Root element not found')
}
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
