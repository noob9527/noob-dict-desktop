import { Runtime } from './runtime';

export const Env = loadEnv();

/**
 * todo: we need ensure that it works in dev, prod, test environment.
 *
 * `import.meta.env` is the standard way to access env in vite build system.
 *
 * however, access it in jest environment would throw
 * 'SyntaxError: Cannot use 'import.meta' outside a module'.
 * even worse, it's a 'build time' error, not runtime error.
 * I haven't found a way to solve it.
 *
 * i.e. all tests import { Env } from this file will throw error.
 *
 * @see https://vitejs.dev/guide/env-and-mode
 * @see https://github.com/IndexXuan/vite-plugin-env-compatible/tree/main
 */
function loadEnv() {
  if (Runtime.isDev) {
    // somehow this doesn't work when app is packaged
    return process.env;
  } else {
    // this doesn't work in jest env
    return import.meta.env;
  }
}
