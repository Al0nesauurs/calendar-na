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
      display: "inline",
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
    // TODO please fix this
  }, [])



  // month cal TODO too many call
  const calMonth = () => {
    let monthDate = []
    for (let i = 0; i < 12; i++) {
      let dayOfStartMonth = format(startOfMonth(new Date(2020, i, 1)), 'iii')
      let dateEndOfMonth = getDate(endOfMonth(new Date(2020, i, 1)))
      monthDate.push(
        <div key={monthList[i]} className={(monthIndex === i ? classes.monthStyle : classes.monthStyleHidden) + ' container'}>
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
      let task = tasks.find(e => (e.id === format(new Date(2020, curMonth, tempDate), 'dd MMMM yyyy')))
      curWeek.push(
        <li
          key={monthList[curMonth] + '-date-' + curDate}
          className={task && task.description.length > 0 ? "mark" : ""}
          onClick={() => handleClickDate(tempDate, curMonth)}>
          <span>{curDate}</span>
          <span className="tooltip-text">{task?.description}</span></li>
      )
      curDate += 1
    }
    week.push(<ul key={monthList[curMonth] + '-week-' + week.length + 1} className={classes.firstWeek}>{curWeek}</ul>)
    while (curDate < lastDate) {
      curWeek = []
      for (let i = 0; i < 7 && curDate < lastDate; i++) {
        let tempDate = curDate
        let task = tasks.find(e => (e.id === format(new Date(2020, curMonth, tempDate), 'dd MMMM yyyy')))
        curWeek.push(
          // Todo mark
          <li
            key={monthList[curMonth] + '-date-' + curDate}
            className={task && task.description.length > 0 ? "mark" : ""}
            onClick={() => handleClickDate(tempDate, curMonth)}>
            <span>{curDate}</span>
            <span className="tooltip-text">{task?.description}</span></li>
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

    let newArr = [...tasks]
    let newArrIndex = newArr.map(e => { return e.id })
    let indexZ = newArrIndex.indexOf(selectedDate)
    if (newArr.find(e => (e.id === selectedDate))?.description !== undefined) {
      newArr[indexZ] = {
        description: taskData.description,
        id: selectedDate,
        createdAt: '',
        isDone: false,
        marked: true
      }
      setTasks(newArr)
    } else {
      setTasks([
        ...tasks,
        {
          description: taskData.description,
          id: selectedDate,
          createdAt: '',
          isDone: false,
          marked: true
        },
      ]);
    }
    console.log(taskData, tasks)

    setIsDialogOpen(false)
  };

  function handleClickDate(date: number, month: number) {
    setSelectedDate(format(new Date(2020, month, date), 'dd MMMM yyyy'))
    setIsDialogOpen(true)
  }
  const alltestMonth = calMonth()
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
        {alltestMonth}
      </div>
      <CalendarDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={addTask}
        currentDesc={tasks.find(e => (e.id === selectedDate))?.description || ''}
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
