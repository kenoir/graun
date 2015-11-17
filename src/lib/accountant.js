import Rx from 'rx';

import {Expenses} from './expenses.js';
import {AdNet} from './adnet.js';


const netProfitStream = Rx.Observable.combineLatest(
  Expenses.totalStream,
  AdNet.value,
  (income, costs) => income - costs
)

export const Accountant = {
  profitStream: netProfitStream
}
