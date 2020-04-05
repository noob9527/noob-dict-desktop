import { GlobalHistoryService } from '../../common/services/global-history-service';
import { injectable } from 'inversify';
import { HistoryService, HistoryServiceToken } from '../../common/services/db/history-service';
import { rendererContainer } from '../../common/container/renderer-container';
import { NoteService, NoteServiceToken } from '../../common/services/db/note-service';

@injectable()
export class GlobalHistoryServiceImpl implements GlobalHistoryService {

  private historyService: HistoryService;
  private noteService: NoteService;

  constructor() {
    this.historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);
    this.noteService = rendererContainer.get<NoteService>(NoteServiceToken);
  }

  syncHistories() {
  }
}