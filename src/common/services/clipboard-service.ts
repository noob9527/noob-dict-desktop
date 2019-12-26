export const ClipboardServiceToken = Symbol.for('clipboard-service');

export interface ClipboardService {
  onSelectionTextChange(listener: (newText, oldText) => void)

  onClipboardTextChange(listener: (newText, oldText) => void)

  startListening()

  stopListening()
}