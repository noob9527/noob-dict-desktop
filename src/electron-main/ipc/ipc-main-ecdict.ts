import { ipcMain } from 'electron-better-ipc';
import { ecDictSearchService, isEcDictAvailable } from '../ecdict';
import { EcDictChannel } from '../../electron-shared/ipc/ipc-channel-ecdict';

ipcMain.answerRenderer(EcDictChannel.FETCH_AVAILABLE, async () => {
  return isEcDictAvailable();
});

ipcMain.answerRenderer(EcDictChannel.FETCH_SUGGESTS, async (data: any) => {
  return await ecDictSearchService.fetchSuggests(data.text, data.option);
});

ipcMain.answerRenderer(EcDictChannel.FETCH_RESULT, async (data: any) => {
  return await ecDictSearchService.fetchResult(data.text, data.option);
});

ipcMain.answerRenderer(EcDictChannel.FETCH_RESULT_BATCH, async (data: any) => {
  return await ecDictSearchService.fetchResultBatch(data.textArray, data.option);
});
