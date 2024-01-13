import { SettingUiService } from '../../common/services/setting-ui-service'
import { injectable } from 'inversify'
import { ipcCallMain } from '../utils/ipc-decorator'
import { WindowId } from '../../common/window-id'

@injectable()
export class ElectronSettingUiService implements SettingUiService {
  @ipcCallMain(WindowId.SETTING.name + '/COMMAND')
  async show() {}
}
