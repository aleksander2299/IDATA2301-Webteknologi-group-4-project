import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import LoginPage from './components/LoginPage.jsx'
import Register from './components/Register.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Register />
  </StrictMode>,
)
