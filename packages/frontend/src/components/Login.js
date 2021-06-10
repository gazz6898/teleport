import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  field: {
    marginBottom: theme.spacing(),
  },
  actionBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  loginButton: {},
  paper: {
    padding: theme.spacing(),
  },
});

class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.submit = this.submit.bind(this);

    this.updateEmailField = this.updateField.bind(this, 'email');
    this.updatePasswordField = this.updateField.bind(this, 'password');
  }

  updateField(field, event) {
    this.setState({
      [field]: event.target.value,
    });
  }

  submit() {
    const { onSubmit } = this.props;
    const { email, password } = this.state;

    onSubmit({ email, password });
  }

  render() {
    const { classes } = this.props;
    const { email, password } = this.state;

    return (
      <Container maxWidth='sm'>
        <Paper className={classes.paper}>
          <Typography variant='overline'>Login</Typography>
          <form>
            <TextField
              className={classes.field}
              id='email-input'
              type='email'
              label='Email'
              variant='outlined'
              value={email}
              onChange={this.updateEmailField}
              required
              fullWidth
            />
            <TextField
              className={classes.field}
              id='password-input'
              type='password'
              label='Password'
              variant='outlined'
              value={password}
              onChange={this.updatePasswordField}
              required
              fullWidth
            />
            <div className={classes.actionBar}>
              <Button
                className={classes.loginButton}
                color='primary'
                variant='contained'
                onClick={this.submit}
              >
                Log In
              </Button>
            </div>
          </form>
        </Paper>
      </Container>
    );
  }
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

Login.defaultProps = {};

export default withStyles(styles)(Login);
