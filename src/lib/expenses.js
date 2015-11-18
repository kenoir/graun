import Rx from 'rx';

import {Capi} from './capi.js';
import {Journalists} from './journalists.js';
import {Days} from './days.js';


const dailyExpenses = Capi.cost + Journalists.cost;

const totalExpensesStream = Days.stream.withLatestFrom(
  Capi.cost$,
  Journalists.cost$,
  (days, capiCost, journoCost) => capiCost + journoCost 
)


export const Expenses = {
  totalStream: totalExpensesStream,
}
