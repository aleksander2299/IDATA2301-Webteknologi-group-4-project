import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import LoginPage from './components/LoginPage.jsx'
//import Register from './components/Register.jsx'
import Settings from './components/Settings.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Settings />
  </StrictMode>,
)
