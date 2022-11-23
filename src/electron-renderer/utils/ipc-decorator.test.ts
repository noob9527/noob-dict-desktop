import { getDefaultChannelByMethodName, ipcCallMain } from './ipc-decorator';
import { ipcRenderer } from 'electron-better-ipc';

jest.mock('electron-better-ipc', () => {
  const originalModule = jest.requireActual('electron-better-ipc');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    ipcRenderer: {
      callMain: jest.fn((channel: string, data?: any) => {
        return data;
      }),
    }
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ipc-decorator', () => {
  describe('getDefaultChannelByMethodName', () => {
    it('basic case', () => {
      const res = getDefaultChannelByMethodName('fooBar')
      expect(res).toBe('FOO_BAR')
    });
  });

  describe('ipcCallMain decorator', () => {
    it('basic case', () => {
      const channel = 'whatever';

      class FooService {
        @ipcCallMain(channel)
        foo(param1: string, param2: number): [string, number] {
          return {} as [string, number];
        }
      }

      const params: [string, number] = ['foo', 1];
      const fooService = new FooService();
      const res = fooService.foo(...params);
      expect(res).toStrictEqual(params);
      expect(ipcRenderer.callMain).toBeCalledTimes(1);
      expect(ipcRenderer.callMain).toHaveBeenCalledWith(channel, params);
    });
  });

  // describe('ipcCallMainDelegate decorator', () => {
  //   it('basic case', () => {
  //     @ipcCallMainDelegate()
  //     class FooService {
  //       foo(param1: string, param2: number): [string, number] {
  //         return {} as [string, number];
  //       }
  //     }
  //
  //     const params: [string, number] = ['foo', 1];
  //     const fooService = new FooService();
  //     const res = fooService.foo(...params);
  //     expect(res).toStrictEqual(params);
  //     expect(ipcRenderer.callMain).toBeCalledTimes(1);
  //     expect(ipcRenderer.callMain).toHaveBeenCalledWith('FOO', params);
  //   });
  // });
});
