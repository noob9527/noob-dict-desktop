import { rmSync } from 'node:fs'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';
import { execSync } from 'child_process';

const commitHash = execSync('git rev-parse HEAD').toString().trimEnd();
const commitHashShort = commitHash.slice(0, 7);

process.env.REACT_APP_GIT_COMMIT_HASH = commitHash;
process.env.REACT_APP_GIT_COMMIT_HASH_SHORT = commitHashShort;

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('build', { recursive: true, force: true })

  const isServe = command==='serve';
  const isBuild = command==='build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  const envPrefix = 'REACT_APP_';
  let external = Object.keys('dependencies' in pkg ? pkg.dependencies:{});
  external = [
    ...external,
    // Could not resolve "parse5/lib/parser/open-element-stack" ?
    // I dunno the exact reason, seems unlink then link @noob9527/noob-dict-net-engines solve the issue?
    // 'parse5/lib/parser/open-element-stack',
    // 'parse5',
  ];
  console.log('external: ' + external);

  return {
    envPrefix,
    build: {
      outDir: 'build'
    },
    resolve: {
      // Uncaught TypeError: Unknown theme type: undefined, name: undefined
      // https://github.com/ant-design/ant-design/issues/19002#issuecomment-965958565
      alias: {
        '@ant-design/icons/lib/dist': '@ant-design/icons/lib/index.es.js'
      },
    },
    plugins: [
      react(),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'src/electron-main/main.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App');
            } else {
              options.startup();
            }
          },
          vite: {
            envPrefix,
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'build',
              rollupOptions: {
                external,
              },
              // // required to make yarn link work
              // // "However, this requires the linked dep to be exported as ESM. If not, you can add the dependency to optimizeDeps.include and build.commonjsOptions.include in your config."
              // // "When making changes to the linked dep, restart the dev server with the --force command line option for the changes to take effect."
              // // https://vitejs.dev/guide/dep-pre-bundling#monorepos-and-linked-dependencies
              // commonjsOptions: {
              //   // strictRequires: true,
              //   include: [
              //     /about-window/,
              //     /node_modules/,
              //   ],
              // },
            },
            // // https://vitejs.dev/guide/dep-pre-bundling#monorepos-and-linked-dependencies
            // optimizeDeps: {
            //   include: ['about-window'],
            // },
          },
        },
        {
          entry: 'src/electron-preload.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload();
          },
          vite: {
            envPrefix,
            build: {
              sourcemap: sourcemap ? 'inline':undefined, // #332
              minify: isBuild,
              outDir: 'build',
              rollupOptions: {
                external,
              },
            },
          },
        }
      ]),
      // Use Node.js API in the Renderer-process
      renderer(),
    ],
    // set url to http://127.0.0.1:3000/
    server: (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
      return {
        host: url.hostname,
        port: +url.port,
      };
    })(),
    clearScreen: false,
  };
});
