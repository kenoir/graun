import Rx from 'rx';


const levelMultiplier$ = new Rx.BehaviorSubject(0);

const costCap = 25;
const attrCap = 10;

const idea = (level) => {
  const levelledAttrCap = (level/100) * attrCap;

  const appeal = Math.floor(Math.random() * levelledAttrCap);
  const integrity = Math.floor(Math.random() * levelledAttrCap);

  return {
    appeal,
    integrity
  }
}

const costStream = 
  levelMultiplier$.map((level) => (level/100) * costCap) 

const ideaStream = 
  Rx.Observable.interval(1000).withLatestFrom(
    levelMultiplier$,
    (t, level) => { 
      const i = idea(level)

      return i;
    }
  )

const totalIntegrity =
  ideaStream.startWith(0).scan((acc, idea) => {
    const total = acc + idea.integrity;

    return total;
  }) 

const meanIntegrity = 
  totalIntegrity.startWith(attrCap / 2).map((total, i) => { 
    const mean = total / i;

    return mean;
  })

export const Journalists = {
  level$: levelMultiplier$,
  cost$: costStream,
  ideaStream: ideaStream,
  integrity: meanIntegrity
}
