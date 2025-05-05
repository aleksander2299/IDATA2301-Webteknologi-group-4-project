import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import RoomDetailsPage from './pages/RoomDetailsPage/RoomDetailsPage.jsx';
import SearchPage from './pages/SearchPage/SearchPage.jsx';

const router = createBrowserRouter ([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/room/:id', element: <RoomDetailsPage /> }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
