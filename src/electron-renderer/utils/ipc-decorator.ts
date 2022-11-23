import { ipcRenderer } from 'electron-better-ipc';
import * as lodash from 'lodash';

export function ipcCallMain(
  channelPrefix?: String,
  channel?: string,
) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const actualChannel = (channelPrefix ?? '') + (channel
      ?? getDefaultChannelByMethodName(propertyKey));
    descriptor.value = function (...data: any | null | undefined) {
      return ipcRenderer.callMain(actualChannel, data);
    };
  };
}

// export function ipcCallMainDelegate(
//   channelPrefix: String = '',
// ): ClassDecorator {
//   return function <T extends Function>(
//     target: T
//   ): T | void {
//     const tmp = Object
//       .getOwnPropertyDescriptors(target.prototype);
//     Reflect.ownKeys(target.prototype)
//       .forEach(e => {
//         console.log(e);
//         // const actualChannel = getDefaultChannelByMethodName(propertyKey);
//         // descriptor.value = function (...data: any | null | undefined) {
//         //   return ipcRenderer.callMain(actualChannel, data);
//         // };
//         // return target;
//       });
//   };
// }

export function getDefaultChannelByMethodName(methodName: string): string {
  return lodash.snakeCase(methodName).toUpperCase();
}
