import Rx from 'rx';


const dailyCost = 5;

const idea = () => {
  return {
    appeal: Math.random(),
    integrity: Math.random()
  }
}

const ideaStream = 
  Rx.Observable.interval(1000).map((t) => idea())

export const Journalists = {
  cost: dailyCost,
  ideaStream: ideaStream
} 
