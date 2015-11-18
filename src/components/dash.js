import {h} from '@cycle/dom';

import {Days} from '../lib/days.js';
import {Expenses} from '../lib/expenses.js';
import {Accountant} from '../lib/accountant.js';

import Rx from 'rx';


export const DashComponent = (responses) => {

  const dash = Rx.Observable.combineLatest(
    Days.stream,
    Days.count,
    Expenses.totalStream,
    Accountant.profitStream,
    (day, count, expenses, profits) => {
      return {
        day,
        count,
        expenses,
        profits
      }
    }
  )

  function view() {
    return dash.map((d) => {
      return h('div.dash', [
          h('h1', `${d.day.name}`), 
          h('h2', `Day: ${d.count}`),
          h('h2', `You spent (so far): £${d.expenses}`),
          h('h2', `You are worth (so far): £${d.profits}`)
      ])
    })
  }

  const vtree$ = view();

  return {
    DOM: vtree$,
  };
}
