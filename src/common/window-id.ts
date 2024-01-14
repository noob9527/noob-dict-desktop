import { EnumClass, EnumFactory, EnumValue } from 'effective-enum'

@EnumClass
class WindowId extends EnumFactory<WindowId>() {
  @EnumValue
  static readonly HOME = new WindowId('HOME')
  @EnumValue
  static readonly SETTING = new WindowId('SETTING')
  @EnumValue
  static readonly LOGIN = new WindowId('LOGIN')
  @EnumValue
  static readonly DEVELOPER = new WindowId('DEVELOPER')
  @EnumValue
  static readonly SYNC = new WindowId('SYNC')

  constructor(public label: string) {
    super()
  }
}

// function parseWindowEventChannelName(
//   channelName:string,
// ) {
//   channelName.indexOf('_')
//   // channelName.sub
// }

export { WindowId }
