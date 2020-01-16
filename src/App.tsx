import React, { FC, useEffect, useState, useCallback } from 'react';
import './App.css';
import { format, getDate, getMonth, startOfMonth, endOfMonth } from 'date-fns'
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import CalendarDialog from './components/CalendarDialog';

const App: FC = () => {

  // Get current date
  let todayMonth = getMonth(new Date())

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
    monthStyle: {
      position: "relative",
      backgroundColor: "#C3DEF9",
      display: "table",
      margin: "auto",
      width: "100%",
    },
    monthStyleHidden: {
      position: "fixed",
      display: "none",
      visibility: "hidden"
    },
    firstWeek: {
      justifyContent: 'flex-end'
    },
    botAppBar: {
      display: "none"
    }
  }));


  // Date Constant
  const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const DayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

  const calMonth = () => {
    let monthDate = []
    for (let i = 0; i < 12; i++) {
      let dayOfStartMonth = format(startOfMonth(new Date(2020, i, 1)), 'iii')
      let dateEndOfMonth = getDate(endOfMonth(new Date(2020, i, 1)))
      monthDate.push(
        <div key={monthList[i]} className={(monthIndex === i ? classes.monthStyle : classes.monthStyleHidden)}>
          {calWeek(i, dayOfStartMonth, dateEndOfMonth)}
        </div>
      )
    }
    return monthDate
  }

  // input eg Mon, Tue
  const calWeek = (curMonth: number, day: string, lastDate: number) => {
    lastDate += 1
    let curDate = 1 // date runner
    let emptySpace = []
    let curWeek = []
    let week = []

    //////////////////////// First week Generate ////////////////////////
    for (let i = 0; i < DayList.indexOf(day); i++) {
      // if sunday = no free li if Tue = 2 free li
      emptySpace.push(
        <li key={'space-' + i}></li>
      )
    }
    for (let i = 0; i < 7 - emptySpace.length; i++) {
      curWeek.push(calDate(curDate, curMonth))
      curDate += 1
    }
    week.push(<ul key={monthList[curMonth] + '-week-' + week.length + 1} className={classes.firstWeek}>{curWeek}</ul>)
    //////////////////////// First week Generate ////////////////////////

    while (curDate < lastDate) {
      curWeek = []
      for (let i = 0; i < 7 && curDate < lastDate; i++) {
        curWeek.push(calDate(curDate, curMonth))
        curDate += 1
      }
      week.push(<ul key={monthList[curMonth] + '-week-' + week.length + 1}>{curWeek}</ul>)
    }
    return week
  }

  function calDate (curDate:number, curMonth:number) {
    let task = descriptionList.find(e => (e.id === format(new Date(2020, curMonth, curDate), 'dd MMMM yyyy')))
    return (
      <li
        key={monthList[curMonth] + '-date-' + curDate}
        className={task && task.description.length > 0 ? "mark" : ""}
        onClick={() => handleClickDate(curDate, curMonth)}>
        <span>{curDate}</span>
        <span className="tooltip-text">{task?.description}</span></li>
    )
  }

  const saveDescriptionList = (taskData: Pick<DescriptionCal, 'description'>) => {

    let newDescriptionList = [...descriptionList]
    let newDescription = newDescriptionList.map(e => { return e.id })
    let indexSelectedDescription = newDescription.indexOf(selectedDate)
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
    setIsDialogOpen(false)
  };

  const handleClickDate= useCallback((date: number, month: number) => {
    setSelectedDate(format(new Date(2020, month, date), 'dd MMMM yyyy'))
    setIsDialogOpen(true)
  },[])

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
            <div className={classes.calendarHeaderContent}>{monthList[monthIndex]} 2020</div>
          </Typography>
          <ArrowForwardIosIcon className={nextDisabled ? classes.hiddenButton : classes.calendarNext} onClick={() => { toggleMonth(1) }} />
        </Toolbar>
      </AppBar>

      <div className="container">
        {calMonth()}
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
            <div className={classes.calendarHeaderContent}>{monthList[monthIndex]} 2020</div>
          </Typography>
          <ArrowForwardIosIcon className={nextDisabled ? classes.hiddenButton : classes.calendarNext} onClick={() => { toggleMonth(1) }} />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
