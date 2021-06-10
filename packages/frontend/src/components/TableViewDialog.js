import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { Button } from '@material-ui/core';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: theme.spacing(),
    bottom: theme.spacing(),
    left: theme.spacing(),
    right: theme.spacing(),
  },
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(),
  },
});

class TableViewDialog extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.updateField = this.updateField.bind(this);
    this.renderField = this.renderField.bind(this);
    this.renderFormFields = this.renderFormFields.bind(this);
  }

  onSubmit() {
    const { data } = this.state;
    const { handleClose, onSubmit } = this.props;

    onSubmit(data);

    this.setState({ data: {} });
    handleClose();
  }

  updateField(field, targetValue, event) {
    this.setState(({ data }) => ({ data: { ...data, [field]: event.target[targetValue] } }));
  }

  renderField({ name, label, format, editable = true }) {
    const { data } = this.state;

    if (!editable) {
      return null;
    }

    switch (format) {
      case 'boolean': {
        return (
          <>
            <Typography>{label}</Typography>
            <Checkbox
              id={`field-${name}`}
              key={`field-${name}`}
              onChange={this.updateField.bind(this, name, 'checked')}
              value={data[name]}
            />
          </>
        );
      }
      case 'number': {
        return (
          <TextField
            id={`field-${name}`}
            key={`field-${name}`}
            type='number'
            onChange={this.updateField.bind(this, name, 'value')}
            value={data[name]}
            label={label}
            fullWidth
          />
        );
      }
      default: {
        return (
          <TextField
            id={`field-${name}`}
            key={`field-${name}`}
            onChange={this.updateField.bind(this, name, 'value')}
            value={data[name]}
            label={label}
            fullWidth
          />
        );
      }
    }
  }

  renderFormFields() {
    const { columns } = this.props;

    return columns.map(this.renderField);
  }

  render() {
    const { classes, handleClose, open, title } = this.props;

    return (
      <Dialog className={classes.root} open={open} onBackdropClick={handleClose}>
        <Paper className={classes.paper}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <Container maxWidth='lg'>{this.renderFormFields()}</Container>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onSubmit} variant='contained' color='primary'>
              Submit
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    );
  }
}

TableViewDialog.propTypes = {
  tableName: PropTypes.string.isRequired,

  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
      format: PropTypes.oneOf(['string', 'number', 'boolean']),
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

TableViewDialog.defaultProps = {};

export default withStyles(styles)(TableViewDialog);
