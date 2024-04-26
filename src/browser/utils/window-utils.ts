import { WindowId } from '../../common/window-id'

function getCurrentWindowId() {
  const hash = window?.location?.hash
  switch (hash) {
    case '#/main/search':
      return WindowId.HOME
    case '#/setting':
      return WindowId.SETTING
    case '#/login':
      return WindowId.LOGIN
    case '#/developer':
      return WindowId.DEVELOPER
    case '#/sync':
      return WindowId.SYNC
    default:
      return WindowId.HOME
      // comment out cuz it doesn't work as expected
      // e.g. the url might look like 'localhost:3000/search'
      // if (hash?.includes('/search') || hash?.includes('/main')) {
      //   return WindowId.HOME
      // } else {
      //   throw new Error(`unknown window, hash = ${hash}`)
      // }
  }
}

export { getCurrentWindowId }
