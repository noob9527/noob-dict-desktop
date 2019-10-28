export const ClipboardServiceToken = Symbol.for('clipboard-service');

export interface ClipboardService {
  readClipboardText(): string

  readSelectionText(): string

  onSelectionTextChange(listener: (newText, oldText) => void)

  onClipboardTextChange(listener: (newText, oldText) => void)

  startListening()

  stopListening()
}