import 'reflect-metadata';
import { GlobalHistoryServiceImplV2 } from './global-history-service-impl-v2';
import { MockHistoryService } from './db/mock/mock-history-service';
import { MockNoteService } from './db/mock/mock-note-service';
import { MockUserService } from './mock-user-service';
import { MockAppService } from './mock-app-service';
import { apiAxios } from '../utils/api-axios'


xdescribe('GlobalHistoryServiceImplV2', () => {
  beforeAll(() => {
    apiAxios.defaults.headers.common.tokenHeader = '';
  });

  describe('syncHistories', () => {
    it('basic case', async () => {
      const epoch = new Date(0);
      const globalHistoryService = new GlobalHistoryServiceImplV2(
        // new MockHistoryService(),
        // new MockNoteService(),
        // new MockUserService(),
        // new MockAppService(),
      );
      const request = {
        clientLastSyncTime: epoch,
        lastEvaluatedUpdateAt: epoch,
        itemSinceLastSync: [],
        clientAppId: 'foo',
        syncSizeLimit: 100,
      };
      console.log(JSON.stringify(request));
      let res;
      try{
        res = await globalHistoryService.callSyncHistoryAPI(request);
        console.log(res);
      } catch (e: any) {
        console.log(e.message);
      }
    });
  });
});
