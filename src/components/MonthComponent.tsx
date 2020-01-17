import React, { FC } from 'react'
import { format, getDate, startOfMonth, endOfMonth } from 'date-fns'
import { makeStyles } from '@material-ui/core/styles';
import WeekComponent from './WeekComponent'


interface MonthComponentProps {
  DayList: any;
  monthList: any;
  monthIndex: any;
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
  const { DayList, monthList, monthIndex, descriptionList, handleClickDate } = props;
  const classes = useStyles(props);

  let monthDate = []
  for (let i = 0; i < 12; i++) {
    let dayOfStartMonth = format(startOfMonth(new Date(2020, i, 1)), 'iii')
    let dateEndOfMonth: number = getDate(endOfMonth(new Date(2020, i, 1)))
    monthDate.push(
      <div key={monthList[i]} className={(monthIndex === i ? classes.monthStyle : classes.monthStyleHidden)}>
        {(<WeekComponent
          DayList={DayList}
          monthList={monthList}
          curMonth={i}
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