import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/HomePage';
import VeranstaltungPage from './pages/VeranstaltungPage';
import TeilnehmerTable from './components/TeilnehmerTable';
import LogInPage from './pages/LogInPage';
import ProtectedRoute from './components/ProtectedRoute';
import VeranstaltungFrom from './components/VeranstaltungForm';
import VeranstaltungDashboard from './components/VeranstaltungDashboard';
import GuestPage from './pages/GuestPage';


const router = createBrowserRouter([
  {
    path: '/login',
    element: <LogInPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/GuestPage/:v_id',
    element: (
        <GuestPage />
    ),
  },
  {
    path: '/veranstaltung/:v_id',
    element: (
      <ProtectedRoute>
        <VeranstaltungPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/veranstaltung/:v_id',
        element: 
        <ProtectedRoute><VeranstaltungDashboard /></ProtectedRoute>
      },
      {
        path: '/veranstaltung/:v_id/teilnehmer',
        element: <TeilnehmerTable />
      },
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


