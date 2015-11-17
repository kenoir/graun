import Rx from 'rx';

import {Days} from './days.js';
import {Journalists} from './journalists.js';


const dailyCost = 5;

const headlines = [
  "Dogs and Cats live together in peace!",
  "Eating plutonium causes cancer.",
  "Black pudding found to be sentient.",
  "Tower Hamlets seceedes from UK."
]

const doc = (idea) => {
 const i = Math.floor(Math.random() * 10) % headlines.length

  return {
    title: headlines[i],
    appeal: idea.appeal,
    integrity: idea.appeal 
  }
}

const documentStream = 
  Journalists.ideaStream.map((idea) => doc(idea))

export const Capi = {
  cost: dailyCost,
  stream: documentStream, 
  count: documentStream.startWith(0).scan((acc) => acc + 1)
}
