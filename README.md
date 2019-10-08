# noob dict

### project setup
#### start
to start properly, we have to run
```bash
yarn react:build
```
or copy assets from public/assets to build/assets manually.

#### build explanation
- `react:build` build code under src directory(via react-scripts)
- `electron:build` build code under electron directory(via parcel)
- `build` generate executable files

reference:
- [building-an-electron-application-with-create-react-app](https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/)
- [building-a-production-electron-create-react-app-application-with-shared-code-using-electron-builder](https://medium.com/@johndyer24/building-a-production-electron-create-react-app-application-with-shared-code-using-electron-builder-c1f70f0e2649)
- [how-to-build-an-electron-app-using-create-react-app-and-electron-builder-ss1k0sfer](https://www.codementor.io/randyfindley/how-to-build-an-electron-app-using-create-react-app-and-electron-builder-ss1k0sfer)

### FAQ
Icon doesn't show?
1. do not build or run the app under snap
  For example, if your webstorm is installed via snap, do not run `yarn start` or `yarn build` via the terminal inside webstorm. it leads to the following error
  ```
    (electron:31101): libappindicator-WARNING **: 18:59:31.347: Using '/tmp' paths in SNAP environment will lead to unreadable resources
  ```
