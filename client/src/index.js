import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/HomePage';
import VeranstaltungPage from './pages/VeranstaltungPage';
import LogInPage from './pages/LogInPage';
import ProtectedRoute from './components/ProtectedRoute';
import VeranstaltungDashboard from './components//Veranstaltung/VeranstaltungDashboard';
import GuestPage from './pages/GuestPage';
import UserPage from './pages/UserPage';
import UserForm from './components/Users/UserForm';
import RezepteTable from './components/Rezepte/RezepteTable';
import VeranstaltungRezepteTable from './components/Veranstaltung/VeranstaltungRezepteTable';
import VeranstaltungTeilnehmerTable from './components/Veranstaltung/VeranstaltungTeilnehmerTable';
import VeranstaltungAufgabenTable from './components/Veranstaltung/VeranstaltungAufgabenTable';


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
    path: '/user/:u_id',
    element: (
      <ProtectedRoute>
        <UserPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/user/:u_id',
        element: 
        <ProtectedRoute><UserForm /></ProtectedRoute>
      },
      {
        path: '/user/:u_id/rezepte',
        element: <RezepteTable />
      },
    ]
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
        element: <VeranstaltungTeilnehmerTable />
      },
      {
        path: '/veranstaltung/:v_id/rezepte',
        element: <VeranstaltungRezepteTable />
      },
      {
        path: '/veranstaltung/:v_id/aufgaben',
        element: <VeranstaltungAufgabenTable />
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


