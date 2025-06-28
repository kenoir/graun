import { interval, startWith, scan, map } from 'rxjs';

const weekdays = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const day = (dayCount: number) => {
  return {
    name: weekdays[dayCount % weekdays.length],
    number: dayCount
  };
};

const dayCount = interval(5000).pipe(
  startWith(0),
  scan((acc: number) => acc + 1)
);

export const Days = {
  stream: dayCount.pipe(map((n: number) => day(n))),
  count: dayCount
};
