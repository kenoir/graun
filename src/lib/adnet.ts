import { map, scan, withLatestFrom, combineLatest, BehaviorSubject } from 'rxjs';
import { Frontend } from './frontend';
import { Days } from './days';
import advertsData from '../resources/adverts.json';

const baseCPM = 0.03;
const levelMultiplier$ = new BehaviorSubject(15); // Start with some initial investment

interface Advert {
  company_name: string;
  title: string;
  ad_copy: string;
  rpc: number;
}

interface AdPlacement {
  count: number;
  value: number;
  ads: Advert[];
}

const selectAdverts = (level: number): Advert[] => {
  // Investment affects number of ads placed (1-5 ads based on level)
  const maxAds = Math.max(1, Math.min(5, Math.floor(level / 20) + 1));
  const adCount = Math.floor(Math.random() * maxAds) + 1;
  
  // Select random ads from the available pool
  const selectedAds: Advert[] = [];
  const availableAds = [...advertsData.adverts];
  
  for (let i = 0; i < adCount && availableAds.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableAds.length);
    selectedAds.push(availableAds.splice(randomIndex, 1)[0]);
  }
  
  return selectedAds;
};

const adPlacement = (frontendContent: any, level: number): AdPlacement => { 
  const ads = selectAdverts(level);
  
  // Calculate revenue based on views and RPC (Revenue Per Click/view)
  let totalValue = 0;
  ads.forEach(ad => {
    // RPC acts as a multiplier for revenue generation
    const adRevenue = Math.floor(frontendContent.views * ad.rpc * 0.1); // 0.1 as base multiplier
    totalValue += adRevenue;
  });

  return {
    count: ads.length,
    value: totalValue,
    ads: ads
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
