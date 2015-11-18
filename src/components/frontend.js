import {h} from '@cycle/dom';

import {Frontend} from '../lib/frontend.js';

import Rx from 'rx';


export const FrontendComponent = (responses) => {

  const frontend = Rx.Observable.combineLatest(
    Frontend.stream,
    Frontend.count,
    Frontend.views,
    (content, count, views) => {
      return {
        content,
        count,
        views        
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
    return frontend.withLatestFrom(
      state$,
      (frontend, state) => {

      let {label, unit, min, max} = state.props;
      let value = state.value;

      return h('div.frontend', [
          h('h1', "graun.com"),
          h('h2', `Last Published Content: ${frontend.content.title}`),
          h('h2', `Published Content Count: ${frontend.count}`),
          h('h2', `Pageviews: ${frontend.views}`),
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
