import { MainNoteServiceToken, NoteService } from '../../common/services/db/note-service';
import { mainContainer } from '../../common/container/main-container';
import { MainNoteService } from './main-note-service';
import { HistoryService, MainHistoryServiceToken } from '../../common/services/db/history-service';
import { MainHistoryService } from './main-history-service';

/**
 * should only execute once
 */
export function registerAllService() {
  // const historyService = new MainHistoryService();
  // mainContainer.bind<HistoryService>(MainHistoryServiceToken)
  //   .toConstantValue(historyService);
  // const noteService = new MainNoteService();
  // mainContainer.bind<NoteService>(MainNoteServiceToken)
  //   .toConstantValue(noteService);
  mainContainer.bind<HistoryService>(MainHistoryServiceToken)
    .to(MainHistoryService);
  mainContainer.bind<NoteService>(MainNoteServiceToken)
    .to(MainNoteService);
}
