import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/HomePage';
import App from './App';
import VeranstaltungPage from './pages/VeranstaltungPage';
import TeilnehmerTable from './components/TeilnehmerTable';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/veranstaltung/:v_id',
    element: <VeranstaltungPage />,
    children: [
      {
        path: '/veranstaltung/:v_id/teilnehmer',
        element: <TeilnehmerTable />
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


