import Rx from 'rx';


const dailyCost = 5;
const attrCap = 10;

const idea = () => {
  return {
    appeal: Math.floor(Math.random() * attrCap),
    integrity: Math.floor(Math.random() * attrCap)
  }
}

const ideaStream = 
  Rx.Observable.interval(1000).map((t) => idea())

const totalIntegrity =
  ideaStream.startWith(0).scan((acc, idea) => acc + idea.integrity) 

const meanIntegrity = 
  totalIntegrity.startWith(attrCap / 2).map((total, i) => total / i) 

export const Journalists = {
  cost: dailyCost,
  ideaStream: ideaStream,
  integrity: meanIntegrity
} 
