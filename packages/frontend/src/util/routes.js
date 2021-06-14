import Admin from '~/components/Admin';
import Ride from '~/components/Ride';
import Trips from '~/components/Trips';

export default [
  {
    path: 'ride',
    label: 'Request a Ride',
    Component: Ride,
  },
  {
    path: 'trips',
    label: 'My Trips',
    Component: Trips,
  },

  {
    path: 'admin',
    label: 'Admin',
    Component: Admin,
  },
];
