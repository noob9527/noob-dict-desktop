import { getSuggests, mockGetSuggests, mockSearch, search, SearchOption, Suggest } from "noob-dict-core";
import isDev from 'electron-is-dev';

export {
  fetchSuggests,
  fetchResult,
};

async function fetchSuggests(text: string): Promise<Suggest[]> {
  return mockGetSuggests(text);
  // return getSuggests(text);
  // if (isDev) {
  //   return mockGetSuggests(text);
  // } else {
  //   return getSuggests(text);
  // }
}

async function fetchResult(text: string, option: SearchOption) {
  return search(text, option);
  // if (isDev) {
  //   return mockSearch(text, option);
  // } else {
  //   return search(text, option);
  // }
}

