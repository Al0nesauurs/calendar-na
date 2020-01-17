import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import DateComponenet from './DateComponent'


interface WeekComponentProps {
  dayList: any;
  monthList: any;
  curMonth: any;
  day: any;
  lastDate: number;
  descriptionList: any;
  todayYear: any;
  handleClickDate: any
}

const WeekComponent: FC<WeekComponentProps> = props => {
  let { dayList, monthList, todayYear, curMonth, day, lastDate, descriptionList, handleClickDate } = props;
  const useStyles = makeStyles(theme => ({
    firstWeek: {
      justifyContent: 'flex-end'
    },
  }));
  const classes = useStyles(props);

  lastDate += 1
  let curDate = 1 // date runner
  let emptySpace = []
  let curWeek = []
  let week = []

  //////////////////////// First week Generate ////////////////////////
  for (let i = 0; i < dayList.indexOf(day); i++) {
    // if sunday = no free li if Tue = 2 free li
    emptySpace.push(
      <li key={'space-' + i}></li>
    )
  }
  for (let i = 0; i < 7 - emptySpace.length; i++) {
    curWeek.push(<DateComponenet
      monthList={monthList}
      curMonth={curMonth}
      curDate={curDate}
      descriptionList={descriptionList}
      handleClickDate={handleClickDate}
      todayYear={todayYear}
      key={monthList[curMonth] + '-date-' + curDate}

    />
    )
    curDate += 1
  }
  week.push(<ul key={monthList[curMonth] + '-week-' + week.length + 1} className={classes.firstWeek}>{curWeek}</ul>)
  //////////////////////// First week Generate ////////////////////////

  while (curDate < lastDate) {
    curWeek = []
    for (let i = 0; i < 7 && curDate < lastDate; i++) {
      curWeek.push(<DateComponenet
        monthList={monthList}
        curMonth={curMonth}
        curDate={curDate}
        descriptionList={descriptionList}
        handleClickDate={handleClickDate}
        todayYear={todayYear}
        key={monthList[curMonth] + '-date-' + curDate}
      />
      )
      curDate += 1
    }
    week.push(<ul key={monthList[curMonth] + '-week-' + week.length + 1}>{curWeek}</ul>)
  }
  return (<>{week}</>)
}

export default WeekComponent
