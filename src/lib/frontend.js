import Rx from 'rx';

import {Capi} from './capi.js';


const publishedArticle = (capiDocument) => {
  return {
    title: capiDocument.title + " Now with pictures of Cats!",
    views: Math.floor(Math.random() * capiDocument.idea.integrity * 100)
  }
}

const frontendPublishedStream = 
  Capi.stream.filter(d => {
    return Math.random() * 10 >= 5
  }).map((capiDocument) => publishedArticle(capiDocument))

export const Frontend = {
  stream: frontendPublishedStream,
  count: frontendPublishedStream.startWith(0).scan((acc) => acc + 1),
  views: frontendPublishedStream.startWith(0).scan((acc, x) => acc + x.views)
}
