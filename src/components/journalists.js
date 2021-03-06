import {h} from '@cycle/dom';

import {Journalists} from '../lib/journalists.js';

import Rx from 'rx';


export const JournalistsComponent = (responses) => {

  const journos = Rx.Observable.combineLatest(
    Journalists.ideaStream,
    Journalists.integrity,
    (idea, integrity) => {
      return {
        idea,
        integrity
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
    return journos.withLatestFrom(
      state$,
      (journos, state) => {

      let {label, unit, min, max} = state.props;
      let value = state.value;

      return h('div.journalists', [
          h('h1', "Journalists"),
          h('h2', `Integrity: ${Math.floor(journos.integrity)}`),
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

  actions.changeValue$.map((level) => 
    Journalists.level$.onNext(level)).subscribe();

  return {
    DOM: vtree$,
    events: {
      newValue: actions.changeValue$
    }
  };
}
