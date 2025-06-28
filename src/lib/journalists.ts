import { BehaviorSubject, interval, map, scan, startWith, withLatestFrom } from 'rxjs';

const levelMultiplier$ = new BehaviorSubject(0);

const costCap = 25;
const attrCap = 10;

interface Idea {
  appeal: number;
  integrity: number;
}

const idea = (level: number): Idea => {
  const levelledAttrCap = (level / 100) * attrCap;

  const appeal = Math.floor(Math.random() * levelledAttrCap);
  const integrity = Math.floor(Math.random() * levelledAttrCap);

  return {
    appeal,
    integrity
  };
};

const costStream = levelMultiplier$.pipe(
  map((level: number) => (level / 100) * costCap)
);

const ideaStream = interval(1000).pipe(
  withLatestFrom(levelMultiplier$),
  map(([t, level]: [number, number]) => idea(level))
);

const totalIntegrity = ideaStream.pipe(
  scan((acc: number, idea: Idea) => acc + idea.integrity, 0)
);

const meanIntegrity = totalIntegrity.pipe(
  map((total: number) => {
    const mean = total || (attrCap / 2);
    return mean;
  })
);

export const Journalists = {
  level$: levelMultiplier$,
  cost$: costStream,
  ideaStream: ideaStream,
  integrity: meanIntegrity
};
