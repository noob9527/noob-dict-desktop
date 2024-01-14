import { clearInterval, setInterval } from 'timers'
import logger from '../../electron-shared/logger'

let currentInterval: number
let timer: ReturnType<typeof setInterval> | null = null
let _handler: (() => Promise<void> | void) | null
let log = logger.getLogger('SearchHistorySyncTimer')

export const SearchHistorySyncTimer = {
  setHandler(handler: () => (Promise<void> | void)) {
    _handler = handler
  },

  setInterval(interval: number) {
    if (interval == currentInterval) return
    if (timer) {
      clearInterval(timer)
    }
    if (interval > 0) {
      timer = setInterval(
        () => {
          log.debug('pin')
          if (_handler) {
            log.debug('execute handler')
            _handler()
          } else {
            log.warn('No available handler')
          }
        },
        interval * 60 * 1000,
      )
      currentInterval = interval
    }
  },

  destroy() {
    if (timer) {
      clearInterval(timer)
    }
  },
}
