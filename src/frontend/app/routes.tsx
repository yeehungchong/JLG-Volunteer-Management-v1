import { createBrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage.js';
import { ShiftListPage } from '../pages/ShiftListPage.js';
import { VolunteerListPage } from '../pages/VolunteerListPage.js';

export const router = createBrowserRouter([
  { path: '/', element: <DashboardPage /> },
  { path: '/shifts', element: <ShiftListPage /> },
  { path: '/volunteers', element: <VolunteerListPage /> }
]);
