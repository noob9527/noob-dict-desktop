### opencv 问题
1. node version 问题  
    错误日志示例：
    ```
    Error: The module '/Users/august/projects/node_modules/opencv4nodejs/build/Release/opencv4nodejs.node'
    was compiled against a different Node.js version using
    NODE_MODULE_VERSION 54. This version of Node.js requires
    NODE_MODULE_VERSION 57. Please try re-compiling or re-installing
    ```
    opencv4nodejs, opencv-build 会基于当前 nodejs 版本构建，而当前 nodejs 版本大概率不等于 electron 构建时的 node 版本，因此需要使用 electron-rebuild 库重新构建。
    e.g.
    ```
    electron-rebuild -w opencv4nodejs
   // or electron-rebuild install-app-deps
    ```
2. opencv-build 构建超时  
    opencv-build 包的构建脚本需要从 github clone 代码， 这个过程在墙内很可能会一直卡住，目前我的做法是直接 clone 了 opencv-build, opencv4nodejs 仓库. 然后分别手动通过代理执行 install 脚本，再使用 npm link. 原则上也可以用
    ```bash
      yarn install --ignore-scripts
    ```
    安装，再手动构建，但不知为啥我这边通过这种方式在 yarn install 时经常需要重新构建。
    e.g.
    ```bash
      ## run install script in opencv-build
      cd node_modules/opencv-build
      export http_proxy=your http proxy && node ./install.js
      ## run install script in opencv4nodejs
      cd node_modules/opencv4nodejs
      export http_proxy=your http proxy && node ./install/install.js 
    ```

3. fatal error: opencv2/core.hpp: No such file or directory  
    不知道原因， 目前是通过修改 opencv4nodejs/install/install.js 构建参数解决
      ```javascript
      let flags = process.env.BINDINGS_DEBUG ? '--jobs max --debug' : '--jobs max'
      ```
      to
      ```javascript
      let flags = process.env.BINDINGS_DEBUG ? '--jobs max --debug' : '--jobs max'
      // --target=7.1.6 是 electron 的版本
      flags += ' --target=7.1.6 --arch=x64 "--dist-url=https://www.electronjs.org/headers" "--build-from-source"'
      ```

### tesseract 问题
1. 不知道为啥 Tesseract 目前只能运行在 electron 的主进程，在渲染进程会报错

参考：
- https://github.com/justadudewhohacks/opencv4nodejs#readme
