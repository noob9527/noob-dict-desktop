import { ipcMain, ipcRenderer } from 'electron-better-ipc';
import * as lodash from 'lodash';
import logger from '../../electron-shared/logger';
import { injectable } from 'inversify';


const PREFIX = 'ipcDelegate:';

@injectable()
export abstract class Delegate {
  startListen() {
    logger.debug('startListen', this.constructor.name);

    const keys = Reflect.getMetadataKeys(this)
      .filter(e => e.startsWith(PREFIX))
    const self = this;

    const entries = keys
      .map(key => [key.slice(PREFIX.length), Reflect.getMetadata(key, self)]);

    entries.forEach(([channel, method]) => {
      ipcMain.answerRenderer(channel, async (data: any) => {
        logger.debug('[answer renderer]: parameters', channel, method.name, data);
        const res = method.call(self, ...data);
        logger.debug('[answer renderer]: result', channel, method.name, res);
        return res
      });
    });
  }
}

export function ipcAnswerRenderer(
  channelPrefix?: String,
  channel?: string,
  delimiter?: string,
) {
  const res: MethodDecorator = function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const actualChannel = getActualChannel(
      propertyKey,
      channelPrefix,
      channel,
      delimiter,
    );
    const metaKey = PREFIX + actualChannel;
    Reflect.defineMetadata(metaKey, descriptor.value, target);
  };

  return res;
}

export function ipcCallMain(
  channelPrefix?: String,
  channel?: string,
  delimiter?: string,
) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const actualChannel = getActualChannel(
      propertyKey,
      channelPrefix,
      channel,
      delimiter,
    );
    descriptor.value = function (...data: any | null | undefined) {
      console.debug('[call main] parameters', actualChannel, data);
      const res = ipcRenderer.callMain(actualChannel, data);
      console.debug('[call main] result', actualChannel, res);
      return res;
    };
  };
}

function getActualChannel(
  propertyKey: string | symbol,
  channelPrefix?: String,
  channel?: string,
  delimiter?: string,
): string {
  const d = delimiter ?? '/';
  const c = channel
    ?? getDefaultChannelByMethodName(propertyKey);
  let actualChannel: string;
  if (channelPrefix) {
    actualChannel = `${channelPrefix}${d}${c}`;
  } else {
    actualChannel = c;
  }
  return actualChannel;
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

export function getDefaultChannelByMethodName(
  methodName: string | symbol
): string {
  if (typeof methodName=='symbol') {
    return lodash.snakeCase(methodName.description).toUpperCase();
  } else {
    return lodash.snakeCase(methodName).toUpperCase();
  }
}
