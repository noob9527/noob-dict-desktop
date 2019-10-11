import { getSuggests, search, SearchResult, Suggest } from "noob-dict-core";

// console.log(electron);
//
// const appPath = electron.remote.app.getAppPath();
// console.log(appPath);
//

export {
  fetchSuggests,
  fetchResult,
};

async function fetchSuggests(text: string): Promise<Suggest[]> {
  return getSuggests(text);
}

async function fetchResult(text: string, option: SearchResult): Promise<SearchResult> {
  return search(text, option);
}

// async function fetchResult(text: string, engine: EngineIdentifier): Promise<string> {
//   const path = appPath + '/src/components/dictionaries/bing/fixture/__test_go.html';
//   return new Promise(resolve => {
//     fs.readFile(
//       path,
//       'utf8',
//       (err: any, data: any) => {
//         resolve(data);
//       });
//   });
// }



