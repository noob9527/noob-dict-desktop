import { clipboard } from 'electron';
import EventEmitter from 'events';

enum ClipboardEvents {
  CLIPBOARD_TEXT_CHANGE = 'CLIPBOARD_TEXT_CHANGE',
  SELECTION_TEXT_CHANGE = 'SELECTION_TEXT_CHANGE',
}

function diff(str1, str2) {
  return str2 && str1 !== str2;
}

class ClipboardEventEmitter extends EventEmitter {
  eventEmitter: EventEmitter = new EventEmitter();
  timer: any = null;
  // previousClipboardText = '';
  // previousSelectionText = '';
  previousClipboardText = clipboard.readText('clipboard');
  previousSelectionText = clipboard.readText('selection');

  constructor(
    private listenInterval: number = 500,
  ) {
    super();
  }

  onSelectionTextChange(listener: (newText, oldText) => void) {
    this.eventEmitter.removeAllListeners(ClipboardEvents.SELECTION_TEXT_CHANGE);
    this.eventEmitter.on(ClipboardEvents.SELECTION_TEXT_CHANGE, listener);
  }

  onClipboardTextChange(listener: (newText, oldText) => void) {
    this.eventEmitter.removeAllListeners(ClipboardEvents.CLIPBOARD_TEXT_CHANGE);
    this.eventEmitter.on(ClipboardEvents.CLIPBOARD_TEXT_CHANGE, listener);
  }

  startListening() {
    if (this.timer) return this;
    this.timer = setInterval(() => {
      const previousClipboardText = this.previousClipboardText;
      this.previousClipboardText = clipboard.readText('clipboard');
      if (diff(previousClipboardText, this.previousClipboardText)) {
        this.eventEmitter.emit(ClipboardEvents.CLIPBOARD_TEXT_CHANGE, this.previousClipboardText, previousClipboardText);
      }
      const previousSelectionText = this.previousSelectionText;
      this.previousSelectionText = clipboard.readText('selection');
      if (diff(previousSelectionText, this.previousSelectionText)) {
        this.eventEmitter.emit(ClipboardEvents.SELECTION_TEXT_CHANGE, this.previousSelectionText, previousSelectionText);
      }
    }, this.listenInterval);
  }

  stopListening() {
    if (!this.timer) return this;
    clearInterval(this.timer);
    this.timer = null;
    return this;
  }

}

export {
  ClipboardEventEmitter,
};


