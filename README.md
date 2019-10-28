# noob dict desktop

### Finished feature
- HMR
- Run main and renderer process tests in parallel(via [Jest electron runner](https://github.com/facebook-atom/jest-electron-runner))

### TODO

#### scripts explanation
- `renderer:build` build code under renderer directory(via webpack)
- `main:build` build code under main directory(via parcel)
- `build` generate executable files

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

