import { withLatestFrom, map, scan } from 'rxjs';
import { Days } from './days';
import { Capi } from './capi';
import { Journalists } from './journalists';

const dailyExpense$ = Days.stream.pipe(
  withLatestFrom(
    Capi.cost$,
    Journalists.cost$,
  ),
  map(([days, capiCost, journoCost]: [any, number, number]) => capiCost + journoCost)
);

const totalExpense$ = dailyExpense$.pipe(
  scan((acc: number, dailyExpense: number) => acc + dailyExpense, 0)
);

export const Expenses = {
  daily$: dailyExpense$,
  total$: totalExpense$
};
