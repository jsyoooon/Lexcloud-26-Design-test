
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Tailwind CSS (Must be first to allow overrides)
import './index.css'

// New Global Styles and Tokens (LexCloud 26)
import './assets/styles/globals/index.css'

// Legacy Compatibility (Maps old variables to new tokens)
import './assets/styles/globals/legacy-tokens.css'

// Application Specific Styles (Legacy Layout)
import './styles/accounting.css'

import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
