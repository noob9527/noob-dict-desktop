import { Enum, EnumClass, EnumValue } from 'effective-enum';

@EnumClass
class WindowEvents extends Enum<WindowEvents>() {
  @EnumValue
  static readonly show = new WindowEvents('show');
  @EnumValue
  static readonly hide = new WindowEvents('hide');
  @EnumValue
  static readonly restore = new WindowEvents('restore');
  @EnumValue
  static readonly minimize = new WindowEvents('minimize');
  @EnumValue
  static readonly focus = new WindowEvents('focus');
  @EnumValue
  static readonly blur = new WindowEvents('blur');
  @EnumValue
  static readonly closed = new WindowEvents('closed');

  constructor(
    public name: string,
  ) {
    super();
  }

  toString(): string {
    return this.name;
  }
}

export {
  WindowEvents,
}
