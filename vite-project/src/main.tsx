import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AdminPage from './pages/AdminPage/AdminPage.tsx';
import HomePage from './pages/HomePage/HomePage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.tsx';
import RoomDetailsPage from './pages/RoomDetailsPage/RoomDetailsPage.tsx';
import SearchPage from './pages/SearchPage/SearchPage.tsx';
import UserBookingsPage from './pages/UserBookingsPage/UserBookingsPage.tsx';
import FavouritesPage from './pages/FavouritesPage/FavouritesPage.tsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.tsx';

const router = createBrowserRouter ([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/room/:id', element: <RoomDetailsPage /> },
  { path: '/admin', element: <AdminPage />},
  { path: '/booking', element: <UserBookingsPage /> },
  { path: '/favourites', element: <FavouritesPage /> },
  { path : '/settings', element: <SettingsPage/>}, 


]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
