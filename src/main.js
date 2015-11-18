import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';
import Rx from 'rx';

import {Capi} from './lib/capi.js';
import {Frontend} from './lib/frontend.js';
import {AdNet} from './lib/adnet.js';
import {Days} from './lib/days.js';
import {Expenses} from './lib/expenses.js';
import {Accountant} from './lib/accountant.js';
import {Journalists} from './lib/journalists.js';


function main(responses) {
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

  const days = Rx.Observable.combineLatest(
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

  const ui = Rx.Observable.combineLatest(
    capi,
    frontend,
    adnet,
    days,
    journos,
    (capi, frontend, adnet, days, journos) => {
      return {
        capi,
        frontend,
        adnet,
        days,
        journos
      }
    }
  )

  return {
    DOM: ui.map((e) =>
        h('div', [
          h('div', [
            h('h1', `${e.days.day.name}`), 
            h('h2', `Day: ${e.days.count}`),
            h('h2', `You spent (so far): £${e.days.expenses}`),
            h('h2', `You are worth (so far): £${e.days.profits}`)
          ]),
          h('div', [
            h('h1', "Journalists"),
            h('h2', `Integrity: ${Math.floor(e.journos.integrity)}`)
          ]),
          h('div', [
            h('h1', "CAPI"),
            h('h2', `Last Capi Document: ${e.capi.doc.title}`),
            h('h2', `Capi Written Count: ${e.capi.count}`)
          ]),
          h('div', [
            h('h1', "guardian.com"),
            h('h2', `Last Published Content: ${e.frontend.content.title}`),
            h('h2', `Published Content Count: ${e.frontend.count}`),
            h('h2', `Pageviews: ${e.frontend.views}`)
          ]),
          h('div', [
            h('h1', "AdNet"),
            h('h2', `Num ads placed last: ${e.adnet.ads.count}`),
            h('h2', `You made: £${e.adnet.value}`)
          ])
        ])
      )
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#main-container')
});
