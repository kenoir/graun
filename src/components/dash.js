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

  function model(context, actions) {
    let initialValue$ = context.props.get('initial').first();
    let value$ = initialValue$.concat(actions.changeValue$);
    let props$ = context.props.getAll();
    return Rx.Observable.combineLatest(props$, value$,
      (props, value) => { return {props, value}; }
    );
  }

  function view(state$) {
    return dash.withLatestFrom(
      state$,
      (dash, state) => {

      let {label, unit, min, max} = state.props;
      let value = state.value;

      return h('div.dash', [
          h('h1', `${dash.day.name}`), 
          h('h2', `Day: ${dash.count}`),
          h('h2', `You spent (so far): £${dash.expenses}`),
          h('h2', `You are worth (so far): £${dash.profits}`),
          h('span.label', [label + ' ' + value + unit]),
          h('input.slider', {type: 'range', min, max, value})
      ])
    });
  }

  function intent(DOM) {
    return {
      changeValue$: DOM.select('.slider').events('input')
        .map(ev => { 
          return ev.target.value
        })
    };
  }

  const actions = intent(responses.DOM);
  const vtree$ = view(model(responses, actions));

  return {
    DOM: vtree$,
    events: {
      newValue: actions.changeValue$
    }
  };
}
