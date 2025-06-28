import { combineLatest, map } from 'rxjs';
import { Expenses } from './expenses';
import { AdNet } from './adnet';

const startingFunds = 100;

const netProfitStream = combineLatest([
  AdNet.value,
  Expenses.total$
]).pipe(
  map(([income, costs]: [number, number]) => (income - costs) + startingFunds)
);

export const Accountant = {
  profitStream: netProfitStream
};
