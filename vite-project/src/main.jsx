import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './components/styles/loginstyle.css'
import LoginPage from './components/LoginPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>,
)
