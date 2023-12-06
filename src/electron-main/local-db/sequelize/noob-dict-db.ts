import { Sequelize } from 'sequelize';
import { SearchHistoryModel } from './search-history-model';
import { SearchNoteModel } from './search-note-model';
import logger from '../../../electron-shared/logger';

export class NoobDictDB {

  private sequelize: Sequelize;
  private log = logger.getLogger(NoobDictDB.name);

  constructor(private dbFilePath: string) {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbFilePath,
      define: {
        // freezeTableName: true,
        timestamps: false,
      }
    });
    this.init();
  }

  private init() {
    this.log.info(this.init.name);
    SearchHistoryModel.initModel(this.sequelize);
    SearchNoteModel.initModel(this.sequelize);
    SearchHistoryModel.belongsTo(SearchNoteModel, {
      foreignKey: 'text',
      targetKey: 'text',
      constraints: false,
    });
    SearchNoteModel.hasMany(SearchHistoryModel, {
      sourceKey: 'text',
      foreignKey: 'text',
      constraints: false,
    });

    // NEVER enable `alter`, or `force` option in production!!!
    // seems like there's a bug with alter = true option.
    // the 1st time run it, it will create multi columns unique constraint correctly
    // run it another time will drop the unique index.
    // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
    this.sequelize.sync({ alter: false });
  }

  async testDbConnection(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (e) {
      return false;
    }
  }

}
