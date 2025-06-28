import { BehaviorSubject, map, scan, startWith } from 'rxjs';
import { Days } from './days';
import { Journalists } from './journalists';
import headlinesData from '../resources/headlines.json';

interface CapiDocument {
  title: string;
  body: string;
  sensationalism: number;
  integrity: number;
  idea: {
    appeal: number;
    integrity: number;
  };
}

const costCap = 125;

const levelMultiplier$ = new BehaviorSubject(8);

const costStream = levelMultiplier$.pipe(
  map((level: number) => (level / 100) * costCap)
);

const articles = headlinesData.articles;

const doc = (idea: any): CapiDocument => {
  const i = Math.floor(Math.random() * articles.length);
  const article = articles[i];

  return {
    title: article.headline,
    body: article.body,
    sensationalism: article.sensationalism,
    integrity: article.integrity,
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
  ),
  level$: levelMultiplier$
};
