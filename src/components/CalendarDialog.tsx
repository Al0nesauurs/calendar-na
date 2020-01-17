import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { ChangeEventHandler, FC, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles(theme => ({
  dialog: {
    width: theme.spacing(100),
  },
  dialogContent: {
    padding: theme.spacing(2, 3),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(2, 0, 0, -1),
  },
}));

interface CalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { description: string }) => void;
  selectedDate: string;
  currentDesc: string;
}

const CalendarDialog: FC<CalendarDialogProps> = props => {
  const { isOpen, onClose, onSave, selectedDate, currentDesc } = props;
  const classes = useStyles(props);
  const [description, setDescription] = useState('');

  const updateDescription: ChangeEventHandler<HTMLInputElement> = event =>
    setDescription(event.target.value);

  return (
    <Dialog
      classes={{ paper: classes.dialog }}
      open={isOpen}
      onEnter={() => {
        setDescription(currentDesc)
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">{selectedDate}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.dialogContent}>
        <TextField
          autoFocus
          fullWidth
          multiline
          label="Description"
          onChange={updateDescription}
          value={description}
          inputProps={{ maxLength: 40 }}
        />
        <div className={classes.buttonContainer}>
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => onSave({ description })}
            variant="contained"
          >
            Save
          </Button>
        </div>
      </div>
    </Dialog >
  );
};

export default CalendarDialog;