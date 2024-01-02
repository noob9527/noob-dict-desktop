import { DataTypes, Model, Sequelize } from 'sequelize';
import { INote } from '../../../common/model/note';
import { type ISearchHistory } from '../../../common/model/history';
import { EcDictSearchSuccessResult } from '@noob9527/noob-dict-ecdict';

export class SearchNoteModel extends Model implements INote {

  declare id: string;
  declare user_id: string;
  declare text: string;
  declare remark: string;
  declare update_times: number;
  declare create_at: number;
  declare update_at: number;
  declare histories: ISearchHistory[];
  declare ecDictSearchResult: EcDictSearchSuccessResult | null;

  toDTO(): INote {
    return Object.assign({}, this.toJSON()) as INote;
  }

  static initModel(sequelize: Sequelize) {
    SearchNoteModel.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'uq_user_id_text',
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'uq_user_id_text',
      },
      update_times: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remark: {
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
      tableName: 'search_note',
      // schema: 'main',
    });
  }
}
