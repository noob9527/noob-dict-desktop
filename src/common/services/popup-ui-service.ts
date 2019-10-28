export const PopupUiServiceToken = Symbol.for('popup-ui-service');

export interface PopupUiService {
  show(): Promise<boolean>
  hide()
}
