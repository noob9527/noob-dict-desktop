import { Delegate, ipcAnswerRenderer } from '../../electron-renderer/utils/ipc-decorator';
import { v4 as uuidv4 } from 'uuid';
import {
  HistoryCreateAtSearchParam,
  HistoryParam,
  HistoryService,
  HistoryUpdateAtSearchParam
} from '../../common/services/db/history-service';
import { ISearchHistory } from '../../common/model/history';
import { Page } from '../../common/model/page';
import logger from '../../electron-shared/logger';
import { SearchHistoryModel } from '../local-db/sequelize/search-history-model';
import { LOCAL_DB_HISTORY_PREFIX } from '../../electron-shared/ipc/ipc-channel-local-db';
import { injectable } from 'inversify';
import { Op } from 'sequelize';

@injectable()
export class MainHistoryService extends Delegate implements HistoryService {
  private log = logger.getLogger(MainHistoryService.name);


  @ipcAnswerRenderer(LOCAL_DB_HISTORY_PREFIX)
  async findAll(text: string, user_id: string): Promise<ISearchHistory[]> {
    this.log.debug(this.findAll.name, text, user_id);
    const models = await SearchHistoryModel.findAll({
      where: { text, user_id },
      order: [
        ['update_at', 'DESC'],
      ],
    });
    const res = models.map(e => e.toDTO());
    this.log.debug(this.findAll.name, res);
    return res;
  }

  @ipcAnswerRenderer(LOCAL_DB_HISTORY_PREFIX)
  async list(param: HistoryParam): Promise<Page<ISearchHistory>> {
    this.log.debug(this.list.name, param);

    const sourceLikeLowerCase = param.sourceLike?.toLowerCase();
    const textLikeLowerCase = param.textLike?.toLowerCase();

    const { page, size } = param;
    const offset = (page - 1) * size;

    const where = {
      user_id: param.user_id,
    };
    if (sourceLikeLowerCase) {
      Object.assign(where, {
        context_source: {
          [Op.like]: `%${sourceLikeLowerCase}%`,
        },
      });
    }
    if (textLikeLowerCase) {
      Object.assign(where, {
        text: {
          [Op.like]: `%${textLikeLowerCase}%`,
        },
      });
    }
    const totalCount = await SearchHistoryModel.count({
      where,
    });
    const items = await SearchHistoryModel.findAll(
      {
        where,
        order: [
          ['create_at', 'DESC'],
        ],
        offset: offset,
        limit: size,
      }
    ).then(e => e.map(m => m.toDTO()));

    return Promise.resolve({
      totalCount,
      items,
    });
  }

  @ipcAnswerRenderer(LOCAL_DB_HISTORY_PREFIX)
  searchByCreateAt(param: HistoryCreateAtSearchParam): Promise<ISearchHistory[]> {
    return SearchHistoryModel.findAll({
      where: {
        user_id: param.user_id,
        create_at: {
          [Op.between]: [
            param.createAtBetween.lowerBound,
            param.createAtBetween.upperBound,
          ],
        }
      },
    }).then(e => e.map(m => m.toDTO()));
  }

  @ipcAnswerRenderer(LOCAL_DB_HISTORY_PREFIX)
  searchByUpdateAt(param: HistoryUpdateAtSearchParam): Promise<ISearchHistory[]> {
    return SearchHistoryModel.findAll({
      where: {
        user_id: param.user_id,
        update_at: {
          [Op.between]: [
            param.updateAtBetween.lowerBound,
            param.updateAtBetween.upperBound,
          ],
        }
      },
    }).then(e => e.map(m => m.toDTO()));
  }

  @ipcAnswerRenderer(LOCAL_DB_HISTORY_PREFIX)
  async add(history: ISearchHistory): Promise<ISearchHistory> {
    this.log.debug(this.add.name, history);

    const now = new Date().valueOf();
    history.create_at = history.create_at ?? now;
    history.update_at = history.update_at ?? now;
    history.id = history.id ?? uuidv4();

    // https://sequelize.org/docs/v6/core-concepts/model-instances/#a-very-useful-shortcut-the-create-method
    const model = SearchHistoryModel.of(history);
    await model.save();
    return model.toDTO();
  }

  @ipcAnswerRenderer(LOCAL_DB_HISTORY_PREFIX)
  async update(history: ISearchHistory): Promise<ISearchHistory> {
    this.log.debug(this.update.name, history);

    history.update_at = new Date().valueOf();
    const model = SearchHistoryModel.of(history);
    // somehow model.save() doesn't work here
    // it fire insert query instead of update query.
    await SearchHistoryModel.update({ ...model.toDTO() }, {
      where: {
        id: model.id
      },
      returning: true,
    });

    return model.toDTO();
  }

  // fetch latest source
  @ipcAnswerRenderer(LOCAL_DB_HISTORY_PREFIX)
  async fetchSourceSuggest(text: string, user_id: string): Promise<string[]> {
    this.log.debug(this.fetchSourceSuggest.name, text, user_id);

    let where = { user_id };
    if (text) {
      // ignore case
      let textLowerCase = text.toLowerCase();
      Object.assign(where, {
        context_source: {
          [Op.like]: `%${textLowerCase}%`,
        },
      });
    } else {
      Object.assign(where, {
        context_source: {
          [Op.ne]: '',
        },
      });
    }

    const res = await SearchHistoryModel
      .findAll({
        where,
        order: [
          ['update_at', 'DESC'],
        ],
        limit: 20,
      });

    let tmp = res.map(e => e.context_source ?? '')
      // we do not use Set to remove duplicates as we want to maintain the order
      .filter((e, i, a) => a.indexOf(e)===i)
      .slice(0, 10);

    this.log.debug(this.fetchSourceSuggest.name, tmp);

    return tmp;
  }
}
