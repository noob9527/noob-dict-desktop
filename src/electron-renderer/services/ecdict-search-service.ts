import { SearchService } from '../../common/services/search-service';
import { SearchEmptyResult, SearchOption } from '@noob9527/noob-dict-core';
import { injectable } from 'inversify';
import { ipcRenderer } from 'electron-better-ipc';
import { EcDictSearchSuccessResult, EcDictSuggest } from '@noob9527/noob-dict-ecdict';
import { EcDictChannel } from '../../electron-shared/ipc/ipc-channel-ecdict';

@injectable()
export class EcDictSearchService implements SearchService {
  async fetchAvailable(): Promise<boolean> {
    return ipcRenderer.callMain<any, boolean>(
      EcDictChannel.FETCH_AVAILABLE,
    );
  }

  async fetchSuggests(text: string, option?: SearchOption): Promise<EcDictSuggest[]> {
    return ipcRenderer.callMain<any, EcDictSuggest[]>(
      EcDictChannel.FETCH_SUGGESTS,
      { text, option }
    );
  }

  async fetchResult(text: string, option: SearchOption): Promise<EcDictSearchSuccessResult | SearchEmptyResult> {
    return ipcRenderer.callMain<any, EcDictSearchSuccessResult | SearchEmptyResult>(
      EcDictChannel.FETCH_RESULT,
      { text, option }
    );
  }

  async fetchResultBatch(textArray: string[], option?: SearchOption): Promise<{ [index in string]: EcDictSearchSuccessResult | null }> {
    return ipcRenderer.callMain<any, { [index in string]: EcDictSearchSuccessResult | null }>(
      EcDictChannel.FETCH_RESULT_BATCH,
      { textArray, option },
    );
  }
}
