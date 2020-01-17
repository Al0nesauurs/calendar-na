import React, { FC, useEffect, useState, useCallback } from 'react';
import './App.css';
import { format, getMonth, getYear } from 'date-fns'
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import CalendarDialog from './components/CalendarDialog';
import MonthComponent from './components/MonthComponent'

const App: FC = () => {

  // Get current date
  let todayMonth = getMonth(new Date())
  let todayYear = getYear(new Date())
  // Use state part
  const [monthIndex, setMonthIndex] = useState(todayMonth)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, setBackDisabled] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('')
  const [descriptionList, setDescriptionList] = useState<DescriptionCal[]>([])

  const useStyles = makeStyles(theme => ({
    calendarHeader: {
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
    },
    calendarHeaderContent: {
      width: "200px",
      textAlign: "center",
    },
    calendarNext: {
      right: 0,
      visibility: "visible",
    },
    calendarBack: {
      visibility: "visible",
    },
    hiddenButton: {
      visibility: "hidden"
    },
    botAppBar: {
      display: "none"
    }
  }));


  // Date Constant
  const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  interface DescriptionCal {
    id: string;
    description: string;
    marked: boolean
  }

  const classes = useStyles();
  const toggleMonth = (itr: number) => {
    setMonthIndex(monthIndex + itr)
    if (monthIndex + itr < 1) {
      setBackDisabled(true)
      setMonthIndex(0)
    } else if (monthIndex + itr > 10) {
      setNextDisabled(true)
      setMonthIndex(11)
    } else {
      setBackDisabled(false)
      setNextDisabled(false)
    }
  }

  const saveDescriptionList = (taskData: Pick<DescriptionCal, 'description'>) => {

    let newDescriptionList = [...descriptionList]
    let newDescription = newDescriptionList.map(e => { return e.id })
    let indexSelectedDescription = newDescription.indexOf(selectedDate)
    if (taskData.description.replace(/\s/g, '').length <= 0) {
      // do nothing if only space
    } else {
      if (newDescriptionList.find(e => (e.id === selectedDate))?.description !== undefined) {
        newDescriptionList[indexSelectedDescription] = {
          description: taskData.description,
          id: selectedDate,
          marked: true
        }
        setDescriptionList(newDescriptionList)
      } else {
        setDescriptionList([
          ...descriptionList,
          {
            description: taskData.description,
            id: selectedDate,
            marked: true
          },
        ]);
      }
    }
    setIsDialogOpen(false)
  };

  const handleClickDate = useCallback((date: number, month: number) => {
    setSelectedDate(format(new Date(todayYear, month, date), 'dd MMMM yyyy'))
    setIsDialogOpen(true)
  }, [])

  // init page
  useEffect(() => {
    toggleMonth(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="calendar">
      <AppBar position="static">
        <Toolbar className={classes.calendarHeader}>
          <ArrowBackIosIcon className={backDisabled ? classes.hiddenButton : classes.calendarBack} onClick={() => { toggleMonth(-1) }} />
          <Typography variant="h6">
            <div className={classes.calendarHeaderContent}>{monthList[monthIndex]} {todayYear}</div>
          </Typography>
          <ArrowForwardIosIcon className={nextDisabled ? classes.hiddenButton : classes.calendarNext} onClick={() => { toggleMonth(1) }} />
        </Toolbar>
      </AppBar>

      <div className="container">
        <MonthComponent
          dayList={dayList}
          monthList={monthList}
          monthIndex={monthIndex}
          descriptionList={descriptionList}
          todayYear={todayYear}
          handleClickDate={handleClickDate}
        />
      </div>
      <CalendarDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={saveDescriptionList}
        currentDesc={descriptionList.find(e => (e.id === selectedDate))?.description || ''}
        selectedDate={selectedDate}
      />
      <AppBar className="botAppBar" position="static">
        <Toolbar className={classes.calendarHeader}>
          <ArrowBackIosIcon className={backDisabled ? classes.hiddenButton : classes.calendarBack} onClick={() => { toggleMonth(-1) }} />
          <Typography variant="h6">
            <div className={classes.calendarHeaderContent}>{monthList[monthIndex]} {todayYear}</div>
          </Typography>
          <ArrowForwardIosIcon className={nextDisabled ? classes.hiddenButton : classes.calendarNext} onClick={() => { toggleMonth(1) }} />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
