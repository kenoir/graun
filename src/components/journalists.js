import {h} from '@cycle/dom';

import {Journalists} from '../lib/journalists.js';

import Rx from 'rx';


export const JournalistsComponent = (responses) => {

  function model(context, actions) {
    let initialValue$ = context.props.get('initial').first();
    let value$ = initialValue$.concat(actions.changeValue$);
    let props$ = context.props.getAll();
    return Rx.Observable.combineLatest(props$, value$,
      (props, value) => { return {props, value}; }
    );
  }

  function view(state$) {
    return Rx.Observable.combineLatest(
      state$,
      journalists.integrity,
      (state, integrity) => {

      let {label, unit, min, max} = state.props;
      let value = state.value;

      return h('div.journalists', [
          h('h1', "Journalists"),
          h('h2', `Integrity: ${integrity}`),
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
  const journalists = Journalists(actions.changeValue$);
  const vtree$ = view(model(responses, actions));

  return {
    DOM: vtree$,
    events: {
      newValue: actions.changeValue$
    }
  };
}
