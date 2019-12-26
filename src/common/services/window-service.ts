export const WindowServiceToken = Symbol.for('window-service');

export interface WindowService {
  getWindow(windowIdentifier): any | null
}