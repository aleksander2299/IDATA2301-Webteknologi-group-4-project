import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AdminPage from './pages/AdminPage/AdminPage.tsx';
import FavouritesPage from './pages/FavouritesPage/FavouritesPage.tsx';
import HomePage from './pages/HomePage/HomePage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import ProviderPage from './pages/ProviderPage/ProviderPage.tsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.tsx';
import RoomDetailsPage from './pages/RoomDetailsPage/RoomDetailsPage.tsx';
import SearchPage from './pages/SearchPage/SearchPage.tsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.tsx';
import UserBookingsPage from './pages/UserBookingsPage/UserBookingsPage.tsx';
import ImageTestPage from "./pages/test/ImageTestPage.tsx";

const router = createBrowserRouter ([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/room/:id', element: <RoomDetailsPage /> },
  { path: '/admin', element: <AdminPage />},
  { path: '/booking', element: <UserBookingsPage /> },
  { path: '/favourites', element: <FavouritesPage /> },
  { path: '/settings', element: <SettingsPage />},
  { path: '/provider', element: <ProviderPage />},
  { path: '/test', element: <ImageTestPage />}


]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
