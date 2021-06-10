import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import request from '~/util/request';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.dark,

    display: 'flex',
    flexDirection: 'column',
  },
  banner: {
    flexGrow: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    width: '100%',
    padding: theme.spacing(),
    color: theme.palette.text.primary,
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing(),
    width: '100%',
    backgroundColor: theme.palette.background.main,
  },
  leafletContainer: {
    width: '100%',
    height: '60vh',
    filter: 'brightness(90%)',
  },
  fullpaper: {
    height: '100%',
    padding: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  secondaryPaper: {
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(),
  },
  multiline: {},
  flexRow: {
    display: 'flex',
  },
  spacer: {
    flexGrow: 1,
  },
});

class Ride extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      city: '',
      state: '',
      zip: '',
      data: {
        hubs: [],
        vehicles: [],
      },
      map: null,
    };

    this.updateAddressField = this.updateField.bind(this, 'address');
    this.updateCityField = this.updateField.bind(this, 'city');
    this.updateStateField = this.updateField.bind(this, 'state');
    this.updateZipField = this.updateField.bind(this, 'zip');
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async updatePositionData() {
    const { coords } = await new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej)
    );
    this.setState({ map: { center: [coords.latitude, coords.longitude], zoom: 13 } });
  }

  async fetchData() {
    const data = await request({ route: 'ride', body: {} });

    this.setState({ data });
  }

  updateField(field, event) {
    this.setState({
      [field]: event.target.value,
    });
  }

  render() {
    const { classes } = this.props;
    const { address, city, state, zip, data, map } = this.state;

    if (!map) {
      this.updatePositionData();
      return null;
    }

    return (
      <div className={classes.root}>
        <div className={classes.banner}>
          <Typography variant='h2'>
            <u>Request a Ride</u>
          </Typography>
        </div>
        <Paper className={classes.container} square>
          <Grid container spacing={1}>
            <Grid item xs={7}>
              <Paper className={classes.fullpaper}>
                <MapContainer
                  className={classes.leafletContainer}
                  center={map.center}
                  zoom={map.zoom}
                  scrollWheelZoom
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />
                  {data.hubs.map(({ latitude, longitude }) => (
                    <Marker position={[latitude, longitude]}>
                      <Popup>Vehicle Hub</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Paper>
            </Grid>
            <Grid item xs={5}>
              <Paper className={classes.fullpaper}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Paper className={classes.secondaryPaper} elevation={0}>
                      <Typography align='center'>Select a destination.</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className={classes.multiline}
                      id='address-input'
                      label='Address'
                      variant='outlined'
                      value={address}
                      onChange={this.updateAddressField}
                      required
                      fullWidth
                      multiline
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      className={classes.field}
                      id='city-input'
                      label='City'
                      variant='outlined'
                      value={city}
                      onChange={this.updateCityField}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      className={classes.field}
                      id='state-input'
                      label='State'
                      variant='outlined'
                      value={state}
                      onChange={this.updateStateField}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      className={classes.field}
                      id='zip-input'
                      label='ZIP'
                      variant='outlined'
                      value={zip}
                      onChange={this.updateZipField}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <span className={classes.flexRow}>
                  <Button color='primary' variant='contained' disabled>
                    Back
                  </Button>
                  <span className={classes.spacer} />
                  <Button color='primary' variant='contained'>
                    Next
                  </Button>
                </span>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

Ride.propTypes = {};

Ride.defaultProps = {};

export default withStyles(styles)(Ride);
