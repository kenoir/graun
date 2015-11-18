import {h} from '@cycle/dom';

import {Capi} from '../lib/capi.js';

import Rx from 'rx';


export const CapiComponent = (responses) => {

  const capi = Rx.Observable.combineLatest(
    Capi.stream,
    Capi.count,
    (doc, count) => {
      return {
        doc,
        count
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
    return capi.withLatestFrom(
      state$,
      (capi, state) => {

      let {label, unit, min, max} = state.props;
      let value = state.value;

      return h('div.capi', [
          h('h1', "CAPI"),
          h('h2', `Last Capi Document: ${capi.doc.title}`),
          h('h2', `Capi Written Count: ${capi.count}`),
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
