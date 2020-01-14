import React, { ChangeEvent, FC, useEffect, useCallback, useState } from 'react';
import './App.css';
import { format, getDate, getMonth, getWeekOfMonth, lastDayOfMonth, startOfMonth, endOfMonth, formatRelative, subDays } from 'date-fns'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const App: React.FC = () => {


  // Get current date
  let todayDate = getDate(new Date())
  let todayMonth = getMonth(new Date())

  // Use state part
  const [monthIndex, setMonthIndex] = useState(todayMonth)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, setBackDisabled] = useState(false)

  console.log('Last Day of month is: ', format(lastDayOfMonth(new Date()), 'ii'))
  console.log('Last Day of month is: ', format(lastDayOfMonth(new Date()), 'iii'))
  console.log(format(new Date(), 'iiii'))
  const useStyles = makeStyles(theme => ({
    mainButton: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      position: 'fixed',
    },
    calendarHeader: {
      display: "flex",
      backgroundColor: "red",
      width: "100%"
    },
    calendarNext: {
      right: 0,
      position: 'fixed',
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
    },
    monthStyleHidden: {
      position: "fixed",
      visibility: "hidden",
    },
    firstWeek: {
      justifyContent:'flex-end'
    }
  }));
  const classes = useStyles();

  // Date Constant
  const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const DayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
    console.log('test count')
    // TODO please fix this
  }, [])



  // month cal
  function calMonth() {
    let monthDate = []
    for (let i = 0; i < 12; i++) {
      let dayOfStartMonth = format(startOfMonth(new Date(2020, i, 1)), 'iii')
      let dateEndOfMonth = getDate(endOfMonth(new Date(2020, i, 1)))
      monthDate.push (
        // month content
        <div key={monthList[i]} className={monthIndex === i ? classes.monthStyle : classes.monthStyleHidden}>
            {calWeek(dayOfStartMonth, dateEndOfMonth)}
        </div>
      )
    }
    return monthDate
  }

  // input eg Mon, TUe
  function calWeek(day: string, lastDate: number) {
    lastDate+=1
    let curDate = 1
    let emptyDate = []
    let curWeek = []
    let week = []
    for (let i = 0; i < DayList.indexOf(day); i++) {
      // if sunday = no free li if Tue = 2 free li
      emptyDate.push(
        <li></li>
      )
    }
    for (let i = 0; i < 7 - emptyDate.length; i++) {
      curWeek.push(
        // Todo mark
        <li><span>{curDate}</span></li>
      )
      curDate+=1
    }
    week.push(<ul className={classes.firstWeek}>{curWeek}</ul>)
    while (curDate < lastDate) {
      curWeek = []
      for (let i = 0; i < 7 && curDate < lastDate; i++) {
        curWeek.push(
          // Todo mark
          <li><span>{curDate}</span></li>
          )
          curDate+=1
        }
        week.push(<ul>{curWeek}</ul>)
      }
    return week
  }

  return (
    <div className="calendar">
      <div className={classes.calendarHeader}>
        <ArrowBackIosIcon className={backDisabled ? classes.hiddenButton : classes.calendarBack} onClick={() => { toggleMonth(-1) }} />
        <div className="header">{monthList[monthIndex]} 2020</div>
        <ArrowForwardIosIcon className={nextDisabled ? classes.hiddenButton : classes.calendarNext} onClick={() => { toggleMonth(1) }} />
      </div>
      <div className="container">
        <ul className="firstweek">
          <li><span>Sunday</span></li>
          <li><span>Monday</span></li>
          <li><span>Tuesday</span></li>
          <li><span>Wednesday</span></li>
          <li><span>Thursday</span></li>
          <li><span>Friday</span></li>
          <li><span>Saturday</span></li>
        </ul>
        {calMonth()}
      </div>
    </div>
  );
}

export default App;
