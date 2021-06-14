import React, { PureComponent, useContext, createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';
import routes from '~/util/routes';

import withAuth from '~/hoc/withAuth';

import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Login from '~/components/Login';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 64,
    bottom: 0,
    left: 0,
    right: 0,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: theme.palette.background.dark,
    overflow: 'hidden',
  },

  actionBar: {
    justifyContent: 'flex-end',
  },

  paper: {
    padding: theme.spacing(),
  },

  link: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(),
    '&:last-child': {
      marginRight: 0,
    },
  },

  spacer: {
    flexGrow: 1,
  },

  userLabel: {
    marginRight: theme.spacing(),
    lineHeight: 1,
  },
});

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { auth, classes } = this.props;

    return (
      <Router>
        <div className={classes.root}>
          <nav>
            <AppBar color='primary'>
              <Toolbar>
                {routes.map(({ path, label }) => (
                  <Link key={path} className={classes.link} to={`/${path}`}>
                    {label}
                  </Link>
                ))}
                <span className={classes.spacer} />
                {auth.user ? (
                  <Typography className={classes.userLabel}>{auth.user.email}</Typography>
                ) : null}
                <Link className={classes.link} to='/login' onClick={auth.signout}>
                  {auth.user ? 'Log out' : 'Log in'}
                </Link>
              </Toolbar>
            </AppBar>
          </nav>
          <Switch>
            {routes.map(
              ({
                path,
                Component = () => (
                  <Container maxWidth='sm'>
                    <Paper className={classes.paper} />
                  </Container>
                ),
                componentProps = {},
              }) => (
                <Route
                  key={path}
                  path={`/${path}`}
                  render={({ location }) =>
                    auth.user ? (
                      <Component auth={auth} {...componentProps} />
                    ) : (
                      <Redirect
                        to={{
                          pathname: '/login',
                          state: { from: location },
                        }}
                      />
                    )
                  }
                />
              )
            )}

            <Route
              key='login'
              path='/login'
              render={({ location, ...rest }) =>
                auth.user ? (
                  <Redirect to={{ pathname: '/ride' }} />
                ) : (
                  <Login onSubmit={auth.signin} />
                )
              }
            />

            <Route key='*' path='*'>
              <Container maxWidth='sm'>
                <Paper className={classes.paper}>
                  <Typography variant='h1' align='center'>
                    404
                  </Typography>
                  <Typography variant='body1' align='center'>
                    There are plenty of places we can take you, but that isn't one of them.
                  </Typography>
                </Paper>
              </Container>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  auth: PropTypes.shape({
    signin: PropTypes.func.isRequired,
    signout: PropTypes.func.isRequired,
    user: PropTypes.string,
  }).isRequired,
  classes: PropTypes.object.isRequired,
};

App.defaultProps = {};

export default withStyles(styles)(withAuth(App));
