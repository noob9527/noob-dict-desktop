import { DataTypes, Model, Sequelize } from 'sequelize';
import { ISearchHistory } from '../../../common/model/history';
import { Context } from '../../../common/model/search-domain';
import logger from '../../../electron-shared/logger';


export class SearchHistoryModel extends Model {

  declare id: string;
  declare user_id: string;
  declare text: string;

  declare context_source: string | null;
  declare context_paragraph: string | null;

  declare create_at: number;
  declare update_at: number;

  static of(history: ISearchHistory): SearchHistoryModel {
    const model = {
      ...history,
      context_source: history.context?.source,
      context_paragraph: history.context?.paragraph,
    }
    logger.debug('SearchHistory.of', model);
    return super.build(model);
  }

  get context(): Context | null {
    return this.context_paragraph ? {
      paragraph: this.context_paragraph ?? '',
      source: this.context_source ?? '',
      remark: '',
    } : null;
  }

  toDTO(): ISearchHistory {
    return {
      ...this.toJSON(),
      context: this.context,
    }
  }

  static initModel(sequelize: Sequelize) {
    SearchHistoryModel.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      context_source: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      context_paragraph: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      create_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      update_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'search_history',
      indexes: [{ fields: ['text'] }],
      // schema: 'main',
    });
  }
}


