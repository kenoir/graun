import {h} from '@cycle/dom';

import {AdNet} from '../lib/adnet.js';

import Rx from 'rx';


export const AdNetComponent = (responses) => {

  const adnet = Rx.Observable.combineLatest(
    AdNet.stream,
    AdNet.value,
    (ads, value) => {
      return {
        ads,
        value 
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
    return adnet.withLatestFrom(
      state$,
      (adnet, state) => {

      let {label, unit, min, max} = state.props;
      let value = state.value;

      return h('div.adnet', [
          h('h1', "AdNet"),
          h('h2', `Num ads placed last: ${adnet.ads.count}`),
          h('h2', `You made: £${adnet.value}`),
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
