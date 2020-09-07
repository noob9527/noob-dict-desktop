import {
  HistoryCreateAtSearchParam,
  HistoryParam,
  HistoryService,
  HistoryUpdateAtSearchParam,
} from '../../../common/services/db/history-service';
import { ISearchHistory, SearchHistory } from '../../../common/model/history';
import database from './database';
import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../../common/utils/logger';
import { Page } from '../../../common/model/page';

@injectable()
export class DexieHistoryService implements HistoryService {
  private log = logger.getLogger(DexieHistoryService.name);

  async findAll(text: string, user_id: string = ''): Promise<ISearchHistory[]> {
    const res = await database.histories
      .where({ text, user_id })
      .toArray();
    return res.map(e => SearchHistory.wrap(e));
  }

  async list(param: HistoryParam): Promise<Page<ISearchHistory>> {
    const sourceLikeLowerCase = param.sourceLike?.toLowerCase();
    const textLikeLowerCase = param.textLike?.toLowerCase();

    const { page, size } = param;
    const start = (page - 1) * size;
    const end = start + size;

    const res = await database.histories
      .orderBy('create_at')
      .reverse()
      .filter(e => e.user_id === param.user_id
        // source like
        && (sourceLikeLowerCase == null || (!!e.context?.source?.trim() // source cannot be empty
          && e.context!!.source!!.toLowerCase().includes(sourceLikeLowerCase)))
        // text like
        && (textLikeLowerCase == null || e.text.toLowerCase().includes(textLikeLowerCase))
      ).toArray();
    const items = res.slice(start, end);
    return {
      totalCount: res.length,
      items,
    };
  }

  async searchByCreateAt(param: HistoryCreateAtSearchParam): Promise<ISearchHistory[]> {
    const res = await database.histories
      .where('create_at')
      .between(
        param.createAtBetween.lowerBound,
        param.createAtBetween.upperBound ?? (new Date()).getTime(),
        param.createAtBetween.includeLower ?? true,
        param.createAtBetween.includeUpper ?? true,
      )
      .filter(e => e.user_id === param.user_id)
      .toArray();
    return res.map(e => SearchHistory.wrap(e));
  }

  async searchByUpdateAt(param: HistoryUpdateAtSearchParam): Promise<ISearchHistory[]> {
    const res = await database.histories
      .where('update_at')
      .between(
        param.updateAtBetween.lowerBound,
        param.updateAtBetween.upperBound ?? (new Date()).getTime(),
        param.updateAtBetween.includeLower ?? true,
        param.updateAtBetween.includeUpper ?? true,
      )
      .filter(e => e.user_id === param.user_id)
      .toArray();
    return res.map(e => SearchHistory.wrap(e));
  }

  async add(history: ISearchHistory): Promise<ISearchHistory> {
    this.log.debug(this.add.name, history);

    const now = new Date().valueOf();
    history.create_at = history.create_at ?? now;
    history.update_at = history.update_at ?? now;
    history.id = history.id ?? uuidv4();
    await database.histories.add(history);
    return history;
  }

  async update(history: ISearchHistory): Promise<ISearchHistory> {
    history.update_at = new Date().valueOf();
    await database.histories.update(history.id!!, history);
    return history;
  }

  // fetch latest source
  async fetchSourceSuggest(text: string, user_id: string): Promise<string[]> {
    // ignore case
    let textLowerCase = text.toLowerCase();
    let res = await database.histories
      .orderBy('update_at')
      .reverse()
      .filter(e => e.user_id === user_id
        && !!e.context?.source?.trim() // source cannot be empty
        && e.context!!.source!!.toLowerCase().includes(textLowerCase))
      .toArray();

    let tmp = res.map(e => e.context?.source ?? '')
      // we do not use Set to remove duplicates as we want to maintain the order
      .filter((e, i, a) => a.indexOf(e) === i);
    return tmp.slice(0, 10);
  }

}
