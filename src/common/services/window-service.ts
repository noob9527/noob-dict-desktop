import { WindowId } from '../window-id';
import { WindowCommand } from '../window-command';

export const WindowServiceToken = Symbol.for('window-service');

export interface WindowService {
  sendCommand(windowId: WindowId, command: WindowCommand)
}