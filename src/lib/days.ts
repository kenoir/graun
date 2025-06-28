import { interval, startWith, scan, map, combineLatest } from 'rxjs';

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

// Main day counter (changes every 5 seconds)
const dayCount = interval(5000).pipe(
  startWith(0),
  scan((acc: number) => acc + 1)
);

// Progress through current day (updates every 100ms)
const dayProgress = interval(100).pipe(
  startWith(0),
  scan((acc: number) => (acc + 100) % 5000), // Reset every 5 seconds
  map((ms: number) => ms / 5000) // Convert to percentage (0-1)
);

export const Days = {
  stream: dayCount.pipe(map((n: number) => day(n))),
  count: dayCount,
  progress: dayProgress
};
