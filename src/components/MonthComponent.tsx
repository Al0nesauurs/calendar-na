import React, { FC } from 'react'
import { format, getDate, startOfMonth, endOfMonth } from 'date-fns'
import { makeStyles } from '@material-ui/core/styles';
import WeekComponent from './WeekComponent'


interface MonthComponentProps {
  dayList: any;
  monthList: any;
  monthIndex: any;
  todayYear: any;
  descriptionList: any;
  handleClickDate: any;
}

const MonthComponent: FC<MonthComponentProps> = props => {

  const useStyles = makeStyles(theme => ({
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
  }));
  const { dayList, monthList, todayYear, monthIndex, descriptionList, handleClickDate } = props;
  const classes = useStyles(props);

  let monthDate = []
  for (let i = 0; i < 12; i++) {
    let dayOfStartMonth = format(startOfMonth(new Date(todayYear, i, 1)), 'iii')
    let dateEndOfMonth: number = getDate(endOfMonth(new Date(todayYear, i, 1)))
    monthDate.push(
      <div key={monthList[i]} className={(monthIndex === i ? classes.monthStyle : classes.monthStyleHidden)}>
        {(<WeekComponent
          dayList={dayList}
          monthList={monthList}
          curMonth={i}
          todayYear={todayYear}
          day={dayOfStartMonth}
          lastDate={dateEndOfMonth}
          descriptionList={descriptionList}
          handleClickDate={handleClickDate}
        />)}
      </div>
    )
  }
  return <>{monthDate}</>
}

export default MonthComponent