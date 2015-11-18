import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';
import Rx from 'rx';

import {DashComponent} from './components/dash.js';
import {JournalistsComponent} from './components/journalists.js';
import {CapiComponent} from './components/capi.js';
import {FrontendComponent} from './components/frontend.js';
import {AdNetComponent} from './components/adnet.js';


function intent(DOM) {
  return {};
}

function model(actions) {
  return Rx.Observable.interval(1000)
}

function view(state) {
  return state.map(() =>
    h('div', [
      h('dash#dash', {
        key: 0, label: 'Investment', unit: 'Units',
        min: 0, initial: 0, max: 100
      }),
      h('journalists#journalists', {
        key: 1, label: 'Investment', unit: 'Units',
        min: 0, initial: 0, max: 100
      }),
      h('capi#capi', {
        key: 2, label: 'Investment', unit: 'Units',
        min: 0, initial: 0, max: 100
      }),
      h('frontend#frontend', {
        key: 3, label: 'Investment', unit: 'Units',
        min: 0, initial: 0, max: 100
      }),
      h('adnet#adnet', {
        key: 4, label: 'Investment', unit: 'Units',
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
    'dash': DashComponent,
    'journalists': JournalistsComponent,
    'capi': CapiComponent,
    'frontend': FrontendComponent,
    'adnet': AdNetComponent 
  })
});
