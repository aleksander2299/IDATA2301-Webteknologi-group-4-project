import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import HomePage from './components/Homepage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HomePage/>
  </StrictMode>,
)
