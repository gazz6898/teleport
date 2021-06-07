import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Login from '~/components/Login';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: theme.palette.background.dark,
    padding: theme.spacing(),
  },

  actionBar: {
    justifyContent: 'flex-end',
  },

  paper: {
    padding: theme.spacing(),
  },
});

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      backendResponse: null,
      loading: true,
    };

    this.login = this.login.bind(this);
  }

  async componentDidMount() {
    const response = await fetch('http://localhost:4000/')
      .then(res => res.json())
      .catch(console.error);
    this.setState({
      backendResponse: response,
      loading: false,
    });
  }

  async login({ email, password }) {
    console.log({ email, password });
  }

  render() {
    const { classes } = this.props;
    const { backendResponse, loading } = this.state;

    return (
      <div className={classes.root}>
        <Container maxWidth='sm'>
          <Paper className={classes.paper}>
            <Typography variant='overline'>Login</Typography>
            <Login onSubmit={this.login} />
          </Paper>
        </Container>
      </div>
    );
  }
}

App.propTypes = {};

App.defaultProps = {};

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(withStyles(styles)(App));
