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
  DRIVE: {
    tableName: 'Drive',

    title: 'Drives',
    columns: [
      { name: 'drive_id', label: 'Drive ID', format: 'number', editable: false },
      { name: 'trip_id', label: 'Trip ID', format: 'number' },
      { name: 'vehicle_id', label: 'Vehicle ID', format: 'number' },
      { name: 'start_lat', label: 'Start Latitude', format: 'number' },
      { name: 'start_lon', label: 'Start Longitude', format: 'number' },
      { name: 'end_lat', label: 'End Latitude', format: 'number' },
      { name: 'end_lon', label: 'End Longitude', format: 'number' },
    ],
    labelField: 'user_id',
  },
  HUB: {
    tableName: 'Hub',

    title: 'Hubs',
    columns: [
      { name: 'hub_id', label: 'Hub ID', format: 'number', editable: false },
      { name: 'latitude', label: 'Latitude', format: 'number' },
      { name: 'longitude', label: 'Longitude', format: 'number' },
    ],
    labelField: 'user_id',
  },
  TRIP: {
    tableName: 'Trip',

    title: 'Trips',
    columns: [
      { name: 'trip_id', label: 'Trip ID', format: 'number', editable: false },
      { name: 'user_id', label: 'User ID', format: 'number' },
      {
        name: 'price',
        label: 'Price',
        format: 'number',
        transformer: value => `$${value.toFixed(2)}`,
      },
      { name: 'issued_at', label: 'Issued At', format: 'string' },
    ],
    labelField: 'trip_id',
  },
  USER: {
    tableName: 'User',

    title: 'Users',
    columns: [
      { name: 'user_id', label: 'User ID', format: 'number', editable: false },
      { name: 'active', label: 'Active', format: 'boolean' },
      { name: 'is_admin', label: 'Admin', format: 'boolean' },
      { name: 'username', label: 'Username', format: 'string' },
      { name: 'pass_hash', label: 'Password Hash', format: 'string' },
    ],
    labelField: 'user_id',
  },
  VEHICLE: {
    tableName: 'Vehicle',

    title: 'Vehicles',
    columns: [
      { name: 'vehicle_id', label: 'Vehicle ID', format: 'number', editable: false },
      { name: 'hub_id', label: 'Hub ID', format: 'number' },
      { name: 'charge', label: 'Charge', format: 'number', transformer: value => `${value}%` },
      { name: 'latitude', label: 'Latitude', format: 'number' },
      { name: 'longitude', label: 'Longitude', format: 'number' },
    ],
    labelField: 'vehicle_id',
  },
};

class Admin extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { dialogs: {}, refresh: false };

    this.deleteRecords = this.deleteRecords.bind(this);
    this.deleteDrives = this.deleteRecords.bind(this, 'Drive');
    this.deleteHubs = this.deleteRecords.bind(this, 'Hub');
    this.deleteTrips = this.deleteRecords.bind(this, 'Trip');
    this.deleteUsers = this.deleteRecords.bind(this, 'User');
    this.deleteVehicles = this.deleteRecords.bind(this, 'Vehicle');

    this.insertRecord = this.insertRecords.bind(this);
    this.insertDrive = this.insertRecords.bind(this, 'Drive');
    this.insertHub = this.insertRecords.bind(this, 'Hub');
    this.insertTrip = this.insertRecords.bind(this, 'Trip');
    this.insertUser = this.insertRecords.bind(this, 'User');
    this.insertVehicle = this.insertRecords.bind(this, 'Vehicle');

    this.dialogHandlers = {};

    for (const table of ['Drive', 'Hub', 'Trip', 'User', 'Vehicle']) {
      this.dialogHandlers[table] = this.toggleDialog.bind(this, table);
    }
  }

  componentDidUpdate() {
    const { refresh } = this.state;
    if (refresh) {
      this.setState({ refresh: false });
    }
  }

  async deleteRecords(tableName, selection) {
    const keyColumn = `${tableName.toLowerCase()}_id`;
    await request({
      route: 'delete',
      body: {
        column: keyColumn,
        values: [selection.map(data => data[keyColumn])],
        tableName,
      },
    });

    this.setState({ refresh: true });
  }

  async insertRecords(tableName, formData) {
    const filledColumns = TABLE_PROPS[tableName.toUpperCase()].columns
      .filter(({ name, editable = true }) => editable && formData[name] !== undefined)
      .map(({ name }) => name);

    const data = 
    await request({
      route: 'insert',
      body: {
        columns: filledColumns,
        values: [formData],
        tableName,
      }
    });

    this.setState({ refresh: true });
  }

  toggleDialog(tableName) {
    this.setState(({ dialogs }) => ({ dialogs: { ...dialogs, [tableName]: !dialogs[tableName] } }));
  }

  render() {
    const { dialogs, refresh } = this.state;
    const { auth, classes } = this.props;

    return (
      <Grid className={classes.root} container spacing={1}>
        <Grid item xs={12}>
          <TableView
            {...TABLE_PROPS.DRIVE}
            actions={[
              {
                InnerComponent: AddIcon,
                innerComponentProps: { color: 'primary' },
                title: 'Add',
                action: () => {
                  this.dialogHandlers['Drive']();
                },
              },
              {
                InnerComponent: DeleteIcon,
                innerComponentProps: { color: 'error' },
                title: 'Delete',
                action: this.deleteDrives,
                disabled: selection => !selection.length,
              },
            ]}
            refresh={refresh}
            toggleFormDialog={this.dialogHandlers['Drive']}
            showFormDialog={dialogs['Drive']}
            onFormDialogSubmit={this.insertDrive}
          />
        </Grid>
        <Grid item xs={12}>
          <TableView
            {...TABLE_PROPS.HUB}
            actions={[
              {
                InnerComponent: AddIcon,
                innerComponentProps: { color: 'primary' },
                title: 'Add',
                action: () => {
                  this.dialogHandlers['Hub']();
                },
              },
              {
                InnerComponent: DeleteIcon,
                innerComponentProps: { color: 'error' },
                title: 'Delete',
                action: this.deleteHubs,
                disabled: selection => !selection.length,
              },
            ]}
            refresh={refresh}
            toggleFormDialog={this.dialogHandlers['Hub']}
            showFormDialog={dialogs['Hub']}
            onFormDialogSubmit={this.insertHub}
          />
        </Grid>
        <Grid item xs={12}>
          <TableView
            {...TABLE_PROPS.TRIP}
            actions={[
              {
                InnerComponent: AddIcon,
                innerComponentProps: { color: 'primary' },
                title: 'Add',
                action: () => {
                  this.dialogHandlers['Trip']();
                },
              },
              {
                InnerComponent: DeleteIcon,
                innerComponentProps: { color: 'error' },
                title: 'Delete',
                action: this.deleteTrips,
                disabled: selection => !selection.length,
              },
            ]}
            refresh={refresh}
            toggleFormDialog={this.dialogHandlers['Trip']}
            showFormDialog={dialogs['Trip']}
            onFormDialogSubmit={this.insertTrip}
          />
        </Grid>
        <Grid item xs={12}>
          <TableView
            {...TABLE_PROPS.USER}
            actions={[
              {
                InnerComponent: AddIcon,
                innerComponentProps: { color: 'primary' },
                title: 'Add',
                action: () => {
                  this.dialogHandlers['User']();
                },
              },
              {
                InnerComponent: DeleteIcon,
                innerComponentProps: { color: 'error' },
                title: 'Delete',
                action: this.deleteUsers,
                disabled: selection => !selection.length,
              },
            ]}
            refresh={refresh}
            toggleFormDialog={this.dialogHandlers['User']}
            showFormDialog={dialogs['User']}
            onFormDialogSubmit={this.insertUser}
          />
        </Grid>
        <Grid item xs={12}>
          <TableView
            {...TABLE_PROPS.VEHICLE}
            actions={[
              {
                InnerComponent: AddIcon,
                innerComponentProps: { color: 'primary' },
                title: 'Add',
                action: () => {
                  this.dialogHandlers['Vehicle']();
                },
              },
              {
                InnerComponent: DeleteIcon,
                innerComponentProps: { color: 'error' },
                title: 'Delete',
                action: this.deleteVehicles,
                disabled: selection => !selection.length,
              },
            ]}
            refresh={refresh}
            toggleFormDialog={this.dialogHandlers['Vehicle']}
            showFormDialog={dialogs['Vehicle']}
            onFormDialogSubmit={this.insertVehicle}
          />
        </Grid>
      </Grid>
    );
  }
}

Admin.propTypes = {
  auth: PropTypes.shape({
    signin: PropTypes.func.isRequired,
    signout: PropTypes.func.isRequired,
    user: PropTypes.string,
  }).isRequired,
  classes: PropTypes.object.isRequired,
};

Admin.defaultProps = {};

export default withStyles(styles)(Admin);
