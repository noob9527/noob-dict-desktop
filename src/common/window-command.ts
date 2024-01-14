import { EnumFactory, EnumClass, EnumValue } from 'effective-enum';
import { WindowId } from './window-id';

@EnumClass
class WindowCommand extends EnumFactory<WindowCommand>() {
  @EnumValue
  static readonly open = new WindowCommand('open');
  @EnumValue
  static readonly show = new WindowCommand('show');
  @EnumValue
  static readonly hide = new WindowCommand('hide');
  @EnumValue
  static readonly toggle = new WindowCommand('toggle');
  // @EnumValue
  // static readonly restore = new WindowCommands('restore');
  // @EnumValue
  // static readonly minimize = new WindowCommands('minimize');
  // @EnumValue
  // static readonly focus = new WindowCommands('focus');
  @EnumValue
  static readonly close = new WindowCommand('close');
  @EnumValue
  static readonly top = new WindowCommand('top');

  constructor(
    public override name: string,
  ) {
    super();
  }

  /**
   * WARN:
   * todo:
   * to work with ipc-decorator
   * we simply transform the name into upper case.
   * this may introduce problems in future
   * e.g. consider a command consists of multiple words?
   *
   * e.g.
   * - HOME/COMMAND/SHOW
   * - HOME/COMMAND/HIDE
   * - HOME/COMMAND/CLOSE
   *
   * @param windowId
   */
  getIpcChannelName(
    windowId: WindowId
  ): string {
    return `${windowId}/COMMAND/${this.name.toUpperCase()}`;
  }

  override toString(): string {
    return this.name;
  }
}

export {
  WindowCommand,
}
