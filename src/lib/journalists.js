import Rx from 'rx';


export const Journalists = (levelMultiplier$) => { 

  const dailyCost = 5;
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
  
  const ideaStream = 
    Rx.Observable.interval(1000).withLatestFrom(
      levelMultiplier$,
      (t, level) => idea(level)
    )
  
  const totalIntegrity =
    ideaStream.startWith(0).scan((acc, idea) => acc + idea.integrity) 
  
  const meanIntegrity = 
    totalIntegrity.startWith(attrCap / 2).map((total, i) => total / i) 

  return {
    cost: dailyCost,
    ideaStream: ideaStream,
    integrity: meanIntegrity
  }
}
