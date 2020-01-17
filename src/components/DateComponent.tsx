import React from 'react'
import { format } from 'date-fns'

const DateComponenet = (props: { monthList: any; curMonth: any; curDate: any; descriptionList: any; handleClickDate: any; }) => {
  let { monthList, curMonth, curDate, descriptionList, handleClickDate } = props;

  let task = descriptionList.find((e: { id: string; }) => (e.id === format(new Date(2020, curMonth, curDate), 'dd MMMM yyyy')))
  return (
    <li
      key={monthList[curMonth] + '-date-' + curDate}
      className={task && task.description.length > 0 ? "mark" : ""}
      onClick={() => handleClickDate(curDate, curMonth)}>
      <span>{curDate}</span>
      <span className="tooltip-text">{task?.description}</span></li>
  )
}

export default DateComponenet