import { EcDict, EcDictSearchSuccessResult, EcDictSuggest } from '@noob9527/noob-dict-ecdict';
import { SearchEmptyResult, SearchOption } from '@noob9527/noob-dict-core';
import logger from '../electron-shared/logger';

let ecDict: EcDict | null = null;

export function handleEcDictFileLocationChange(newValue: string | null, oldValue: string | null = null) {
  if (newValue===oldValue) return newValue;
  logger.log('Ecdict file location has been set to: ' + newValue);
  if (newValue) {
    try {
      ecDict = new EcDict(newValue);
    } catch (e) {
      ecDict = null;
    }
  } else {
    ecDict = null;
  }
}

export async function isEcDictAvailable(): Promise<boolean> {
  if (ecDict==null) return Promise.resolve(false);
  return ecDict.testDbConnection();
}

export const ecDictSearchService = {
  async fetchResult(text: string, option?: SearchOption): Promise<EcDictSearchSuccessResult | SearchEmptyResult> {
    if (!ecDict) throw new Error('EcDict has not be initialized!');
    return ecDict.search(text, option);
  },

  async fetchResultBatch(textArray: string[], option?: SearchOption)
    : Promise<{ [index in string]: EcDictSearchSuccessResult | null }> {
    if (!ecDict) throw new Error('EcDict has not be initialized!');
    return ecDict.searchBatch(textArray, option);
  },

  async fetchSuggests(text: string, option: SearchOption): Promise<EcDictSuggest[]> {
    if (!ecDict) throw new Error('EcDict has not be initialized!');
    return ecDict.getSuggests(text, option);
  }
};
