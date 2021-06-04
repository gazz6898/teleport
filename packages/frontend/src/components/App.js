import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

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
});

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      backendResponse: null,
      loading: true,
    };
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

  render() {
    const { classes } = this.props;
    const { backendResponse, loading } = this.state;

    return (
      <div className={classes.root}>
        <Container maxWidth='sm'>
          <Card>
            <CardHeader title='Teleport Login Placeholder' />
            <CardContent>
              <Typography>
                {loading ? 'Loading...' : backendResponse ? 'Backend Response:' : 'No response :('}
              </Typography>
              <pre>{loading ? '' : JSON.stringify(backendResponse, null, 2)}</pre>
            </CardContent>
            <CardActions className={classes.actionBar}>
              <Button color='primary' variant='contained'>
                One Button
              </Button>
              <Button color='secondary' variant='contained'>
                Two Button
              </Button>
            </CardActions>
          </Card>
        </Container>
      </div>
    );
  }
}

App.propTypes = {};

App.defaultProps = {};

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(withStyles(styles)(App));
