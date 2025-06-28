import { BehaviorSubject, map, scan, startWith } from 'rxjs';
import { Days } from './days';
import { Journalists } from './journalists';

interface CapiDocument {
  title: string;
  idea: {
    appeal: number;
    integrity: number;
  };
}

const costCap = 125;

const levelMultiplier$ = new BehaviorSubject(50);

const costStream = levelMultiplier$.pipe(
  map((level: number) => (level / 100) * costCap)
);

const headlines = [
  "Dogs and Cats live together in peace!",
  "Eating plutonium causes cancer.",
  "Black pudding found to be sentient.",
  "Tower Hamlets seceedes from UK."
];

const doc = (idea: any): CapiDocument => {
  const i = Math.floor(Math.random() * 10) % headlines.length;

  return {
    title: headlines[i],
    idea: idea
  };
};

const documentStream = Journalists.ideaStream.pipe(
  map((idea: any) => doc(idea))
);

export const Capi = {
  cost$: costStream,
  stream: documentStream,
  count: documentStream.pipe(
    scan((acc: number) => acc + 1, 0)
  )
};
