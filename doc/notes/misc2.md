# noob dict desktop

### Build Tools
The project is initially generated via "create-react-app", we then ejected the config and did some customization. \
Then we move to vite, you may want to check out the following links:
- https://github.com/electron-vite/vite-plugin-electron
- https://github.com/electron-vite/vite-plugin-electron-renderer
- https://github.com/electron-vite/electron-vite-react

during the migration from webpack to vite, I left jest/babel config unchanged, babel is only used for jest now. i.e. if we set up a new unit test framework, we can safely remove all babel related config/dependencies.

### Scripts explanation
TBD

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

### Publish
> Recommended GitHub Releases Workflow

<div style="text-decoration: line-through">
1. Draft a new release. Set the “Tag version” to the value of version in your application package.json, and prefix it with v. “Release title” can be anything you want.  
  For example, if your application package.json version is 1.0, your draft’s “Tag version” would be v1.0.
2. Push some commits. Every CI build will update the artifacts attached to this draft.
3. Once you are done, publish the release. GitHub will tag the latest commit for you.

The benefit of this workflow is that it allows you to always have the latest artifacts, and the release can be published once it is ready.  
reference:
- [publish](https://www.electron.build/configuration/publish)
</div>

1. (Optional) If you want to release a new version, increase version in your application package.json.
2. Merge your commits into master branch, then push it. This will trigger "release" github workflow.
3. (You don't need to do anything here, Github workflow will finish the job for you) During "release" workflow, if these isn't exist a draft release corresponding to current version(version in package.json). electron-builder will automatically create one for you. Otherwise, electron-builder will (create/update) built files in current draft release.

### Known issue
1. Unable to find icon?
  ```
  Error: Failed to load image from path '../noob-dict-desktop/build/assets/icon/icon.png'
  at Binding2.createTray [as dynamicValue] (../build/main.js:4884:16)
  ```
  to start properly, we have to run
  ```bash
  yarn vite:build
  ```
  at least once, or we can copy assets from public/assets to build/assets manually.
