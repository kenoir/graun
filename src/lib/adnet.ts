import { map, scan } from 'rxjs';
import { Frontend } from './frontend';

const CPM = 0.05;
const adCounter = () => Math.floor(Math.random() * 3);

interface AdPlacement {
  count: number;
  value: number;
  title: string;
}

const adPlacement = (frontendContent: any): AdPlacement => { 
  const adCount = adCounter(); 

  return {
    count: adCount, 
    value: Math.floor(frontendContent.views * CPM * adCount),
    title: "Buy Stuff!"
  };
};

const adNetStream = Frontend.stream.pipe(
  map((content: any) => adPlacement(content))
);
  
export const AdNet = {
  stream: adNetStream,
  value: adNetStream.pipe(
    scan((acc: number, x: AdPlacement) => acc + x.value, 0)
  )
};
