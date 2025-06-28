import { map, scan, withLatestFrom, combineLatest, BehaviorSubject } from 'rxjs';
import { Frontend } from './frontend';
import { Days } from './days';

const baseCPM = 0.03;
const levelMultiplier$ = new BehaviorSubject(15); // Start with some initial investment

const adCounter = (level: number) => {
  // Investment affects number of ads placed (1-5 ads based on level)
  const maxAds = Math.max(1, Math.min(5, Math.floor(level / 20) + 1));
  return Math.floor(Math.random() * maxAds) + 1;
};

interface AdPlacement {
  count: number;
  value: number;
  title: string;
}

const adPlacement = (frontendContent: any, level: number): AdPlacement => { 
  const adCount = adCounter(level);
  // Investment also affects CPM (0.03 base + up to 0.05 bonus)
  const cpm = baseCPM + (level / 100) * 0.05;
  const value = Math.floor(frontendContent.views * cpm * adCount);

  return {
    count: adCount, 
    value: value,
    title: "Buy Stuff!"
  };
};

const adNetStream = Frontend.stream.pipe(
  withLatestFrom(levelMultiplier$),
  map(([content, level]) => adPlacement(content, level))
);

// Track total cumulative value
const totalValue = adNetStream.pipe(
  scan((acc: number, x: AdPlacement) => acc + x.value, 0)
);

// Track daily revenue (resets each day)
const dailyRevenue = combineLatest([
  adNetStream,
  Days.count
]).pipe(
  scan((acc: { total: number; lastDay: number }, [placement, currentDay]: [AdPlacement, number]) => {
    // Reset daily total when day changes
    if (currentDay !== acc.lastDay) {
      return {
        total: placement.value,
        lastDay: currentDay
      };
    }
    // Add to current day's total
    return {
      total: acc.total + placement.value,
      lastDay: currentDay
    };
  }, { total: 0, lastDay: 0 }),
  map(state => state.total)
);
  
export const AdNet = {
  stream: adNetStream,
  value: totalValue,
  dailyRevenue: dailyRevenue,
  level$: levelMultiplier$
};
