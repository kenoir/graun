import { filter, map, scan, startWith } from 'rxjs';
import { Capi } from './capi';

interface FrontendArticle {
  title: string;
  views: number;
}

const publishedArticle = (capiDocument: any): FrontendArticle => {
  return {
    title: capiDocument.title + " Now with pictures of Cats!",
    views: Math.floor(Math.random() * capiDocument.idea.integrity * 100)
  };
};

const frontendPublishedStream = Capi.stream.pipe(
  filter(() => Math.random() * 10 >= 5),
  map((capiDocument: any) => publishedArticle(capiDocument))
);

export const Frontend = {
  stream: frontendPublishedStream,
  count: frontendPublishedStream.pipe(
    scan((acc: number) => acc + 1, 0)
  ),
  views: frontendPublishedStream.pipe(
    scan((acc: number, x: FrontendArticle) => acc + x.views, 0)
  )
};
