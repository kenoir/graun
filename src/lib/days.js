import Rx from 'rx';


const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

const day = (dayCount) => {
  return {
    name: weekdays[dayCount % (weekdays.length)],
    number: dayCount
  }
}


const dayCount = 
  Rx.Observable.interval(5000).startWith(0).scan((acc) => acc + 1)

export const Days = {
  stream: dayCount.map((n) => day(n)),
  count: dayCount
}
