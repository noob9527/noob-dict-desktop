import { UserProfile } from '../electron-shared/user-profile/user-profile'

interface GlobalState {
  trayQuitPressed: boolean
  isSyncing: boolean
  syncOnQuitExecuted: boolean
  profile: UserProfile | null
}

const globalState: GlobalState = {
  // only set to true when user want to quit the app
  // currently, it means the user click quit in the tray menu
  // https://stackoverflow.com/questions/37828758/electron-js-how-to-minimize-close-window-to-system-tray-and-restore-window-back
  trayQuitPressed: false,
  syncOnQuitExecuted: false,
  isSyncing: false,
  profile: null,
}

export default globalState
