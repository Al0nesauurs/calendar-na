import React, { FC, useEffect, useState } from 'react';
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
  const [selectedDate, setSelectedDate] = useState()
  const [tasks, setTasks] = useState<TodoTask[]>([])
  const [allMonth, setAllMonth] = useState([])
  const [currentDesc, setCurrentDesc] = useState('')

  const useStyles = makeStyles(theme => ({
    mainButton: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      position: 'fixed',
    },
    calendarHeader: {
      display: "flex",
      alignContent: "center",
      justifyContent: "center"
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
      visibility: "visible",
      position: "fixed",
      backgroundColor: "#C3DEF9",
    },
    monthStyleHidden: {
      position: "fixed",
      visibility: "hidden",
    },
    firstWeek: {
      justifyContent: 'flex-end'
    }
  }));
  const classes = useStyles();

  // Date Constant
  const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const DayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

  // init page
  useEffect(() => {
    toggleMonth(0)
    console.log('test count', selectedDate, ' ', format(new Date(), 'dd MMMM yyyy'))
    // TODO please fix this
  }, [])


  
  // month cal TODO too many call
  const calMonth = () => {
    let monthDate = []
    for (let i = 0; i < 12; i++) {
      let dayOfStartMonth = format(startOfMonth(new Date(2020, i, 1)), 'iii')
      let dateEndOfMonth = getDate(endOfMonth(new Date(2020, i, 1)))
      monthDate.push(
        // month content
        <div key={monthList[i]} className={monthIndex === i ? classes.monthStyle : classes.monthStyleHidden}>
          {calWeek(i, dayOfStartMonth, dateEndOfMonth)}
        </div>
      )
    }
    return monthDate
  }

  // input eg Mon, TUe
  function calWeek(curMonth: number, day: string, lastDate: number) {
    lastDate += 1
    let curDate = 1
    let emptyDate = []
    let curWeek = []
    let week = []
    for (let i = 0; i < DayList.indexOf(day); i++) {
      // if sunday = no free li if Tue = 2 free li
      emptyDate.push(
        <li key={'space-' + i}></li>
      )
    }
    for (let i = 0; i < 7 - emptyDate.length; i++) {
      let tempDate = curDate
      curWeek.push(
        // Todo mark
        <li
          key={monthList[curMonth] + '-date-' + curDate}
          className={tasks.find(e => (e.id === format(new Date(2020, curMonth, tempDate), 'dd MMMM yyyy'))) ? "mark" : ""}
          onClick={() => handleClickDate(tempDate, curMonth)
          }><span>{curDate}</span><span className="tooltip-text">Chinese New Year</span></li>
      )
      curDate += 1
    }
    week.push(<ul key={monthList[curMonth] + '-week-' + week.length + 1} className={classes.firstWeek}>{curWeek}</ul>)
    while (curDate < lastDate) {
      curWeek = []
      let desc = tasks.find(e => e.id === selectedDate)?.description
      if (!desc || desc === undefined) desc = ""
      for (let i = 0; i < 7 && curDate < lastDate; i++) {
        let tempDate = curDate
        curWeek.push(
          // Todo mark
          <li
            key={monthList[curMonth] + '-date-' + curDate}
            className={tasks.find(e => (e.id === format(new Date(2020, curMonth, tempDate), 'dd MMMM yyyy'))) ? "mark" : ""}
            onClick={() => handleClickDate(tempDate, curMonth) }
          ><span>{curDate}</span><span className="tooltip-text">{desc}</span></li>
        )
        curDate += 1
      }
      week.push(<ul key={monthList[curMonth] + '-week-' + week.length + 1}>{curWeek}</ul>)
    }
    return week
  }

  interface TodoTask {
    id: string;
    description: string;
    isDone: boolean;
    createdAt: string;
    marked: boolean
  }

  const addTask = (taskData: Pick<TodoTask, 'description'>) => {
    console.log(selectedDate)
    setTasks([
      ...tasks,
      {
        ...taskData,
        id: selectedDate,
        createdAt: '',
        isDone: false,
        marked: true
      },
    ]);
    console.log(tasks)
    setIsDialogOpen(false)
  };

  function handleClickDate(date: number, month: number) {
    setSelectedDate(format(new Date(2020, month, date), 'dd MMMM yyyy'))
    setIsDialogOpen(true)
  }
  const alltestMonth = calMonth()

  return (
    <div className="calendar">
      <AppBar position="static" className={classes.calendarHeader}>
        <Toolbar  className={classes.calendarHeader}>
          <ArrowBackIosIcon className={backDisabled ? classes.hiddenButton : classes.calendarBack} onClick={() => { toggleMonth(-1) }} />
          <Typography variant="h6">
            <div className={classes.calendarHeaderContent}>{monthList[monthIndex]} 2020</div>
          </Typography>
          <ArrowForwardIosIcon className={nextDisabled ? classes.hiddenButton : classes.calendarNext} onClick={() => { toggleMonth(1) }} />
        </Toolbar>
      </AppBar>

      <div className="container">
        {alltestMonth}
      </div>
      <CalendarDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={addTask}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default App;
