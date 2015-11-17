import Rx from 'rx';

import {Frontend} from './frontend.js';


const CPM = 0.05;
const adCounter = () => Math.floor(Math.random() * 3)

const adPlacement = (frontendContent) => { 
  const adCount = adCounter(); 

  return {
    count: adCount, 
    value: Math.floor(frontendContent.views * CPM * adCount),
    title: "Buy Stuff!"
  }
}

const adNetStream = 
  Frontend.stream.map((content) => adPlacement(content))
  
export const AdNet = {
  stream: adNetStream,
  value: adNetStream.startWith(0).scan((acc, x) => acc + x.value)
}
