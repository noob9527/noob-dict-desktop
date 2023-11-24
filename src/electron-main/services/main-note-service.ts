import { Delegate, ipcAnswerRenderer } from '../../electron-renderer/utils/ipc-decorator';
import { LOCAL_DB_NOTE_PREFIX } from '../../electron-shared/ipc/ipc-channel-local-db';
import { ISearchHistory } from '../../common/model/history';
import { HistoryService, MainHistoryServiceToken } from '../../common/services/db/history-service';
import { mainContainer } from '../../common/container/main-container';
import { NoteService } from '../../common/services/db/note-service';
import { INote, Note } from '../../common/model/note';
import logger from '../../electron-shared/logger';
import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { SearchNoteModel } from '../local-db/sequelize/search-note-model';
import { SearchHistoryModel } from '../local-db/sequelize/search-history-model';

@injectable()
export class MainNoteService extends Delegate implements NoteService {
  private log = logger.getLogger(MainNoteService.name);

  private historyService: HistoryService;

  constructor() {
    super();
    this.historyService = mainContainer
      .get<HistoryService>(MainHistoryServiceToken);
  }

  @ipcAnswerRenderer(LOCAL_DB_NOTE_PREFIX)
  async fetch(text: string, user_id: string): Promise<Maybe<INote>> {
    this.log.debug(this.fetch.name, text, user_id);
    const model = await SearchNoteModel.findOne({
      where: {
        text,
        user_id,
      }
    });
    const res = model?.toDTO();
    if (res) {
      res.histories = await this.historyService.findAll(text, user_id);
      this.log.debug(this.fetch.name, res.histories);
    }
    return res;
  }

  /**
   * https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
   * @param limit
   * @param user_id
   */
  @ipcAnswerRenderer(LOCAL_DB_NOTE_PREFIX)
  async fetchLatest(limit: number, user_id: string): Promise<INote[]> {
    this.log.debug(this.fetchLatest.name, limit, user_id);
    return SearchNoteModel.findAll({
      where: {
        user_id,
      },
      order: [
        ['update_at', 'DESC'],
      ],
      limit,
    }).then(e => e.map(m => m.toDTO()));
  }

  @ipcAnswerRenderer(LOCAL_DB_NOTE_PREFIX)
  async addHistory(history: ISearchHistory): Promise<INote> {
    this.log.debug(this.addHistory.name, history);

    await this.historyService.add(history);
    let note = await this.fetch(history.text, history.user_id);
    this.log.debug(this.addHistory.name, 'after fetch note 1', note);
    if (!note) {
      note = await Note.create({
        user_id: history.user_id,
        text: history.text
      });
      await this.add(note);
      note.histories.push(history);
    } else {
      await this.update(note);
    }
    this.log.debug(this.addHistory.name, 'after fetch note 2', note);
    return note;
  }

  @ipcAnswerRenderer(LOCAL_DB_NOTE_PREFIX)
  async syncHistory(history: ISearchHistory): Promise<void> {
    this.log.debug(this.syncHistory.name, history);

    const existed = await SearchHistoryModel
      .findByPk(history.id!!);
    if (existed) {
      this.log.debug(this.syncHistory.name, 'update history');
      // we do not call this.historyService.update(history) as we don't want to change history.update_at
      await SearchHistoryModel.build(history).save();
    } else {
      await this.addHistory(history);
    }
  }

  async add(note: INote): Promise<INote> {
    this.log.debug(this.add.name, note);

    const now = new Date().valueOf();
    note.id = uuidv4();
    note.create_at = now;
    note.update_at = now;

    // https://sequelize.org/docs/v6/core-concepts/model-instances/#a-very-useful-shortcut-the-create-method
    return SearchNoteModel.create(note)
      .then(e => e.toDTO());
  }

  async update(note: INote): Promise<INote> {
    this.log.debug(this.update.name, 'before', note);

    // turns out we cannot build then update here.
    // we have to fetch then update.
    // const model = SearchNoteModel.build(note);
    const model  = await SearchNoteModel
      .findByPk(note.id!!).then(e => e!!);

    model.update_times++;
    model.update_at = (new Date()).valueOf();
    model.save();

    this.log.debug(this.update.name, 'after', model.toJSON());

    return model.toDTO();
  }
}
