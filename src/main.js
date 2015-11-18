import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';
import Rx from 'rx';

import {JournalistsComponent} from './components/journalists.js';


function intent(DOM) {
  return {};
}

function model(actions) {
  return Rx.Observable.interval(1000)
}

function view(state) {
  return state.map(() =>
    h('div', [
      h('journalists#weight', {
        key: 1, label: 'Investment', unit: 'Units',
        min: 0, initial: 0, max: 100
      })
    ])
  );
}

function main({DOM}) {
  return {
    DOM: view(model(intent(DOM)))
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#main-container', {
    'journalists': JournalistsComponent
  })
});
