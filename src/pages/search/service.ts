import { getSuggests, search, SearchResult, Suggest, SearchOption } from "noob-dict-core";
// import * as fs from 'fs';
// import * as electron from 'electron';

// const appPath = electron.remote.app.getAppPath();

export {
  fetchSuggests,
  fetchResult,
};

async function fetchSuggests(text: string): Promise<Suggest[]> {
  return getSuggests(text);
}

async function fetchResult(text: string, option: SearchOption): Promise<SearchResult> {
  return search(text, option);
}

// async function fetchResult(text: string, option: SearchOption): Promise<SearchResult> {
//   const path = appPath + '/src/components/dictionaries/bing/fixture/__test_go2.html';
//   return new Promise(resolve => {
//     fs.readFile(
//       path,
//       'utf8',
//       (err: any, data: any) => {
//         resolve({
//           engine: option.engine,
//           processedHtml: data,
//         } as SearchResult);
//       });
//   });
// }

