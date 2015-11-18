import Rx from 'rx';

import {Expenses} from './expenses.js';
import {AdNet} from './adnet.js';

const startingFunds = 100;

const netProfitStream = Rx.Observable.combineLatest(
  AdNet.value,
  Expenses.total$,
  (income, costs) => (income - costs) + startingFunds
)

export const Accountant = {
  profitStream: netProfitStream
}
