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

    firstWeek: {
      justifyContent:'flex-end'
    }
  }));
  const classes = useStyles();
  console.log(format(new Date(), 'iii'))
  console.log(getDate(new Date()))
  console.log(getMonth(new Date(2012, 1, 29)))
  console.log(getWeekOfMonth(new Date()))

  // Date Constant
  const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const DayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const toggleMonth = useCallback((itr: number) => {
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
  }, [])

  // init page
  useEffect(() => {
    toggleMonth(0)
    console.log('test count')
    // TODO please fix this
  }, [])



  // month cal
  function calMonth() {
    console.log('day ', format(startOfMonth(new Date(2020, 1, 1)), 'iii'))
    let monthDate = []
    for (let i = 0; i < 12; i++) {
      let dayOfStartMonth = format(startOfMonth(new Date(2020, i, 1)), 'iii')
      let dateEndOfMonth = getDate(endOfMonth(new Date(2020, i, 1)))
      monthDate[i] = (
        // month content
        <div key={monthList[i]}>
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
        {/* <ul>
          <li><span>5</span></li>
          <li><span>6</span></li>
          <li><span>7</span></li>
          <li className="today"><span>8</span></li>
          <li><span>9</span></li>
          <li><span>10</span></li>
          <li><span>11</span></li>
        </ul>
        <ul>
          <li><span>12</span></li>
          <li><span>13</span></li>
          <li><span>14</span></li>
          <li><span>15</span></li>
          <li><span>16</span></li>
          <li><span>17</span></li>
          <li><span>18</span></li>
        </ul>
        <ul>
          <li><span>19</span></li>
          <li><span>20</span></li>
          <li><span>21</span></li>
          <li><span>22</span></li>
          <li><span>23</span></li>
          <li><span>24</span></li>
          <li className="mark"><span>25</span> <span className="tooltip-text">Chinese New Year</span></li>
        </ul>
        <ul>
          <li className="mark"><span>26</span> <span className="tooltip-text">Chinese New Year</span></li>
          <li className="mark"><span>27</span> <span className="tooltip-text">Chinese New Year</span></li>
          <li><span>28</span></li>
          <li><span>29</span></li>
          <li><span>30</span></li>
          <li><span>31</span></li>
        </ul> */}
      </div>
    </div>
  );
}

export default App;
