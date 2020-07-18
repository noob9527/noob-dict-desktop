[![Build Status](https://travis-ci.org/noob9527/noob-dict-desktop.svg?branch=master)](https://travis-ci.org/noob9527/noob-dict-desktop)
# noob dict desktop

### Finished feature
- HMR
- Run main and renderer process tests in parallel(via [Jest electron runner](https://github.com/facebook-atom/jest-electron-runner))

### Scripts explanation
- `renderer:start` start webpack dev server
- `main:start` build code under electron-main directory with watch option(via parcel)
- `electron:start` concurrently build electron-main directory and run electron
- `start` concurrently run renderer:start and electron:start
- `analyze` [analyzing webpack bundle size](https://create-react-app.dev/docs/analyzing-the-bundle-size/)
- `renderer:build` build code under electron-main && browser directory(via webpack)
- `main:build` build code under electron-main directory(via parcel)
- `electron:build` build executable file(via electron-builder)
- `build` generate executable files
- `release` build and draft a new release(if doesn’t already exist)(this is an automatic rule of electron-builder, because the script is named "release")

In short:
- to run code in dev mode, run `start`, or run `renderer:start` and `electron:start` separately.

Reference:
- https://github.com/electron-userland/electron-builder/issues/2030

### Source code organization(copy from [vscode](https://github.com/microsoft/vscode/wiki/Source-Code-Organization))
- `common`: Source code that only requires basic JavaScript APIs and run in all the other target environments
- `browser`: Source code that requires the browser APIs like access to the DOM
    - may use code from: `common`
- `node`: Source code that requires nodejs APIs
    - may use code from: `common`
- `electron-renderer`: Source code that requires the Electron renderer-process APIs
    - may use code from: `common`, `browser`, `node`
- `electron-main`:
    - may use code from: `common`, `node`

### publish
> Recommended GitHub Releases Workflow

1. Draft a new release. Set the “Tag version” to the value of version in your application package.json, and prefix it with v. “Release title” can be anything you want.  
  For example, if your application package.json version is 1.0, your draft’s “Tag version” would be v1.0.
2. Push some commits. Every CI build will update the artifacts attached to this draft.
3. Once you are done, publish the release. GitHub will tag the latest commit for you.

The benefit of this workflow is that it allows you to always have the latest artifacts, and the release can be published once it is ready.  
reference:  
- [publish](https://www.electron.build/configuration/publish)

### Known issue
Unable to find icon?
to start properly, we have to run
```bash
yarn renderer:build
```
at least once, or we can copy assets from public/assets to build/assets manually.

### FAQ
1. Icon doesn't show?
  do not build or run the app under snap
  For example, if your webstorm is installed via snap, do not run `yarn start` or `yarn build` via the terminal inside webstorm. it leads to the following error
  ```
    (electron:31101): libappindicator-WARNING **: 18:59:31.347: Using '/tmp' paths in SNAP environment will lead to unreadable resources
  ```
1. opencv-build stuck?
  The install script in opencv-build package need to clone several repo from github, in China mainland, this may take forever. try install opencv-build package with
  ```bash
  yarn install --ignore-scripts
  ```
  then run the install script behind proxy
  ```bash
  ## run install script in opencv-build
  cd node_modules/opencv-build
  export http_proxy=your http proxy && node ./install.js
  ## run install script in opencv4nodejs
  cd node_modules/opencv4nodejs
  export http_proxy=your http proxy && node ./install/install.js 
  ```
  reference: https://github.com/justadudewhohacks/opencv4nodejs#readme

1. NODE_VERSION_NUMMBER
```
Error: The module '/Users/august/projects/node_modules/opencv4nodejs/build/Release/opencv4nodejs.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 54. This version of Node.js requires
NODE_MODULE_VERSION 57. Please try re-compiling or re-installing
```
```
electron-rebuild -w opencv4nodejs
```
1. fatal error: opencv2/core.hpp: No such file or directory
  change opencv4nodejs/install/install.js
  ```javascript
  let flags = process.env.BINDINGS_DEBUG ? '--jobs max --debug' : '--jobs max'
  ```
  to
  ```javascript
  let flags = process.env.BINDINGS_DEBUG ? '--jobs max --debug' : '--jobs max'
  flags += ' --target=7.1.6 --arch=x64 "--dist-url=https://www.electronjs.org/headers" "--build-from-source"'
  ```

1. change opencv build version
```json
  "opencv4nodejs": {
    "autoBuildOpencvVersion": "4.1.2"
  }
```
