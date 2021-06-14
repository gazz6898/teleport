import React, { PureComponent, useContext, createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import TableView from '~/components/TableView';

import request from '~/util/request';

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
    overflowY: 'scroll',

    padding: theme.spacing(),
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

const TABLE_PROPS = {
  TRIP: {
    title: 'My Trips',
    columns: [
      { name: 'trip_id', label: 'Trip ID', format: 'number', editable: false },
      { name: 'drive_id', label: 'Drive ID', format: 'number', editable: false, visible: false },
      {
        name: 'price',
        label: 'Price',
        format: 'number',
        transformer: value => `$${value.toFixed(2)}`,
      },
      { name: 'issued_at', label: 'Issued At', format: 'string' },
      { name: 'start_lat', label: 'Start Latitude', format: 'number' },
      { name: 'start_lon', label: 'Start Longitude', format: 'number' },
      { name: 'end_lat', label: 'End Latitude', format: 'number' },
      { name: 'end_lon', label: 'End Longitude', format: 'number' },
      { name: 'vehicle_id', label: 'Vehicle ID', format: 'number', editable: false },
    ],
    labelField: 'drive_id',
  },
};

class Trips extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidUpdate() {
    const { refresh } = this.state;
    if (refresh) {
      this.setState({ refresh: false });
    }
  }

  render() {
    const { dialogs, refresh } = this.state;
    const { auth, classes } = this.props;

    return (
      <div className={classes.root}>
        <TableView {...TABLE_PROPS.TRIP} route={`trips/${auth.user.id}`} actions={[]} />
      </div>
    );
  }
}

Trips.propTypes = {
  auth: PropTypes.shape({
    signin: PropTypes.func.isRequired,
    signout: PropTypes.func.isRequired,
    user: PropTypes.string,
  }).isRequired,
  classes: PropTypes.object.isRequired,
};

Trips.defaultProps = {};

export default withStyles(styles)(Trips);
