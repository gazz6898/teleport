import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from '~/util/redux/store';

import { ThemeProvider } from '@material-ui/styles';
import { theme } from '~/util/theme';

import './index.css';
import App from '~/components/App';

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
