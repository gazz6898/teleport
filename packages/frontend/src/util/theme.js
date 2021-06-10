import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      dark: '#000059',
      main: '#0f48a8',
      light: '#208fff',
    },
    secondary: {
      dark: '#360059',
      main: '#7233b8',
      light: '#8466ff',
    },
    background: {
      dark: '#181821',
      main: '#212132',
      light: '#434354',
      paper: '#323243'
    }
  },
});
