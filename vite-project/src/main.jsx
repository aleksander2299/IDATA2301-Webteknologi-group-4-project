import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

//import HomePage from './components/Homepage.jsx';
import RoomDetails from './components/roomdetails.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoomDetails/>
  </StrictMode>,
)
