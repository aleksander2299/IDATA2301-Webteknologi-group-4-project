import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import RoomDetails from './components/RoomDetails.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoomDetails/>
  </StrictMode>,
)
