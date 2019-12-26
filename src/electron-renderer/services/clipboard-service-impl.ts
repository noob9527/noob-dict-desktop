import { ClipboardEventEmitter } from '../utils/clipboard-event-emitter';
import { injectable } from 'inversify';
import { ClipboardService } from '../../common/services/clipboard-service';

@injectable()
export class ClipboardServiceImpl implements ClipboardService {
  private eventEmitter = new ClipboardEventEmitter();

  onSelectionTextChange(listener: (newText, oldText) => void) {
    this.eventEmitter.onSelectionTextChange(listener);
  }

  onClipboardTextChange(listener: (newText, oldText) => void) {
    this.eventEmitter.onClipboardTextChange(listener);
  }

  startListening() {
    this.eventEmitter.startListening();
  }

  stopListening() {
    this.eventEmitter.stopListening();
  }
}