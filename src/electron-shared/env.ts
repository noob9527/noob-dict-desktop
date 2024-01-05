export const Env = loadEnv()

/**
 * `import.meta.env` is the standard way to access env in vite build system.
 *
 * however, access it in jest environment would throw
 * 'SyntaxError: Cannot use 'import.meta' outside a module'.
 * even worse, it's a 'build time' error, not runtime error.
 *
 * this [vite plugin](https://github.com/IndexXuan/vite-plugin-env-compatible)
 * claims it bind env variables to process.env. but somehow it doesn't work
 * after the app is packaged.
 *
 * currently, we use a "babel plugin" to solve it.
 * - https://vitejs.dev/guide/env-and-mode
 * - https://github.com/vitejs/vite/issues/1149
 * - https://github.com/FredKSchott/create-snowpack-app/commit/c84d51bf5d10db82d6ff459dc9618710ea72f293#diff-93c47b837494a218df311b047db676e584f7a3307ed4c630e1c77dda7a404299
 * - https://github.com/vitejs/vite/issues/1149#issuecomment-756912108
 */
function loadEnv() {
  // return process.env;
  return import.meta.env
}
