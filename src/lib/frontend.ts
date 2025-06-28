import { filter, map, scan, startWith, withLatestFrom, BehaviorSubject } from 'rxjs';
import { Capi } from './capi';
import { Journalists } from './journalists';

interface FrontendArticle {
  title: string;
  body: string;
  views: number;
  sensationalism: number;
  integrity: number;
}

const levelMultiplier$ = new BehaviorSubject(12); // Start with some initial investment

const publishedArticle = (capiDocument: any): FrontendArticle => {
  // Views are influenced by sensationalism (more sensational = more views)
  const baseViews = Math.floor(Math.random() * capiDocument.idea.integrity * 50);
  const sensationalismBonus = capiDocument.sensationalism * 500; // Up to 500 extra views
  const totalViews = Math.floor(baseViews + sensationalismBonus);

  return {
    title: capiDocument.title + " Now with pictures of Cats!",
    body: capiDocument.body,
    views: totalViews,
    sensationalism: capiDocument.sensationalism,
    integrity: capiDocument.integrity
  };
};

const frontendPublishedStream = Capi.stream.pipe(
  withLatestFrom(levelMultiplier$, Journalists.integrity),
  filter(([capiDocument, level, journalistIntegrity]) => {
    // Ensure we always have a reasonable chance of publishing
    // Base publishing chance from investment level (0-100)
    const baseChance = Math.max(40, 20 + (level * 0.75)); // Minimum 40%, up to 95%
    
    // Make integrity filtering less restrictive initially
    // Higher journalist integrity means more selective about article integrity
    const integrityThreshold = Math.min(0.7, journalistIntegrity / 150); // Cap at 0.7, slower scaling
    const articleIntegrity = capiDocument.integrity;
    
    // Integrity modifier: more forgiving for low-integrity articles
    const integrityModifier = articleIntegrity >= integrityThreshold ? 1.0 : 0.75; // 75% instead of 50%
    
    const finalChance = baseChance * integrityModifier;
    return Math.random() * 100 < finalChance;
  }),
  map(([capiDocument, _]) => publishedArticle(capiDocument))
);

export const Frontend = {
  stream: frontendPublishedStream,
  count: frontendPublishedStream.pipe(
    scan((acc: number) => acc + 1, 0)
  ),
  views: frontendPublishedStream.pipe(
    scan((acc: number, x: FrontendArticle) => acc + x.views, 0)
  ),
  level$: levelMultiplier$
};
