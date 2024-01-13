import { LoginUiService } from '../../common/services/login-ui-service'
import { injectable } from 'inversify'
import { ipcCallMain } from '../utils/ipc-decorator'
import { WindowId } from '../../common/window-id'

@injectable()
export class ElectronLoginUiService implements LoginUiService {
  @ipcCallMain(WindowId.LOGIN.name + '/COMMAND')
  async show() {}
}
