import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AddRoomPage from "./pages/AddRoomPage/AddRoomPage.tsx";
import AdminEditRoomPage from "./pages/AdminEditRoomPage/AdminEditRoomPage.tsx";
import AdminPage from './pages/AdminPage/AdminPage.tsx';
import BookingPage from "./pages/BookingPage/BookingPage.tsx";
import FavouritesPage from './pages/FavouritesPage/FavouritesPage.tsx';
import HomePage from './pages/HomePage/HomePage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import ProviderPage from './pages/ProviderPage/ProviderPage.tsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.tsx';
import RoomDetailsPage from './pages/RoomDetailsPage/RoomDetailsPage.tsx';
import SearchPage from './pages/SearchPage/SearchPage.tsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.tsx';
import UserBookingsPage from './pages/UserBookingsPage/UserBookingsPage.tsx';

const router = createBrowserRouter ([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/room/:id', element: <RoomDetailsPage /> },
  { path: '/admin', element: <AdminPage />},
  { path: '/favourites', element: <FavouritesPage /> },
  { path: '/settings', element: <SettingsPage />},
  { path: '/provider', element: <ProviderPage />},
  { path: `/admin/:roomId`, element: <AdminEditRoomPage />},
  { path: 'admin/addRoom', element: <AddRoomPage />},
  { path: '/booking', element: <BookingPage />},

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
