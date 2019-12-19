// for dependency injection
import 'reflect-metadata';
import './services';
import '../browser/index';
import { clipboardEventEmitter } from './clipboard-event-emitter';
import logger from '../common/utils/logger';

clipboardEventEmitter.onClipboardTextChange((...args) => {
  logger.log('clipboard change', ...args);
});
clipboardEventEmitter.onSelectionTextChange((...args) => {
  logger.log('selection change', ...args);
});
clipboardEventEmitter.startListening();