import Rx from 'rx';

import {Capi} from './capi.js';
import {Journalists} from './journalists.js';
import {Days} from './days.js';


const dailyExpense$ = Days.stream.withLatestFrom(
  Capi.cost$,
  Journalists.cost$,
  (days, capiCost, journoCost) => capiCost + journoCost 
)

const totalExpense$ = 
  dailyExpense$.startWith(0).scan((acc, dailyExpense) => acc + dailyExpense) 

export const Expenses = {
  daily$: dailyExpense$,
  total$: totalExpense$
}
