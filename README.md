# noob dict desktop

### Finished feature
- HMR
- Run main and renderer process tests in parallel(via [Jest electron runner](https://github.com/facebook-atom/jest-electron-runner))

### TODO
- remove dva dependency?
- remove antd dependency?
- pin main window
- setting window(modal)
- popup window(frameless)

### Scripts explanation
- `renderer:build` build code under browser directory(via webpack)
- `main:build` build code under electron-main directory(via parcel)
- `build` generate executable files

### Source code organization(copy from [vscode](https://github.com/microsoft/vscode/wiki/Source-Code-Organization))
- `common`: Source code that only requires basic JavaScript APIs and run in all the other target environments
- `browser`: Source code that requires the browser APIs like access to the DOM
    - may use code from: `common`
- `node`: Source code that requires nodejs APIs
    - may use code from: `common`
- `electron-browser`: Source code that requires the Electron renderer-process APIs
    - may use code from: `common`, `browser`, `node`
- `electron-main`:
    - may use code from: `common`, `node`


### Known issue
Unable to find icon?
to start properly, we have to run
```bash
yarn renderer:build
```
at least once, or we can copy assets from public/assets to build/assets manually.

### FAQ
Icon doesn't show?
1. do not build or run the app under snap
  For example, if your webstorm is installed via snap, do not run `yarn start` or `yarn build` via the terminal inside webstorm. it leads to the following error
  ```
    (electron:31101): libappindicator-WARNING **: 18:59:31.347: Using '/tmp' paths in SNAP environment will lead to unreadable resources
  ```

