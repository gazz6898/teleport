import Admin from '~/components/Admin';
import Ride from '~/components/Ride';

export default [
  {
    path: 'ride',
    label: 'Request a Ride',
    Component: Ride,
  },

  {
    path: 'admin',
    label: 'Admin',
    Component: Admin,
  },
];
