import Rx from 'rx';

import {Capi} from './capi.js';
import {Days} from './days.js';


const dailyExpenses = Capi.cost

const totalExpensesStream = Days.stream.startWith(0).scan((acc) => {
  return acc + dailyExpenses;
})

const expensesStream = Days.stream.map((d) => dailyExpenses)

export const Expenses = {
  totalStream: totalExpensesStream,
  stream: expensesStream
}
