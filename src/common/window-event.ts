import { EnumFactory, EnumClass, EnumValue } from 'effective-enum';
import { WindowId } from './window-id';

@EnumClass
class WindowEvent extends EnumFactory<WindowEvent>() {
  @EnumValue
  static readonly show = new WindowEvent('show');
  @EnumValue
  static readonly hide = new WindowEvent('hide');
  @EnumValue
  static readonly restore = new WindowEvent('restore');
  @EnumValue
  static readonly minimize = new WindowEvent('minimize');
  @EnumValue
  static readonly focus = new WindowEvent('focus');
  @EnumValue
  static readonly blur = new WindowEvent('blur');
  @EnumValue
  static readonly closed = new WindowEvent('closed');

  constructor(
    public override name: string,
  ) {
    super();
  }

  /**
   * e.g.
   * - HOME/EVENT/show
   * - HOME/EVENT/hide
   * - HOME/EVENT/closed
   *
   * @param windowId
   */
  getIpcChannelName(
    windowId: WindowId
  ): string {
    return `${windowId}/EVENT/${this}`;
  }

  override toString(): string {
    return this.name;
  }
}

export {
  WindowEvent,
}
