import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//import RoomDetails from './components/roomdetails.jsx';
import HomePage from './components/Homepage.jsx';
import LoginPage from './components/LoginPage.jsx';
import Register from './components/Register.jsx';

const router = createBrowserRouter ([
  {path:'/', element:<HomePage />},
  {path:'/login', element:<LoginPage />},
  {path:'/register', element:<Register />},

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
