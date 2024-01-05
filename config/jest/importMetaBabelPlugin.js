/**
 * @see:
 * - https://github.com/vitejs/vite/issues/1149
 * - https://github.com/FredKSchott/create-snowpack-app/commit/c84d51bf5d10db82d6ff459dc9618710ea72f293#diff-93c47b837494a218df311b047db676e584f7a3307ed4c630e1c77dda7a404299
 * - https://github.com/vitejs/vite/issues/1149#issuecomment-756912108
 */
const template = require('@babel/template').default

const PUBLIC_ENV_REGEX = /^SNOWPACK_PUBLIC_/

function generateEnvObject(mode) {
  const envObject = { ...process.env }
  for (const env of Object.keys(envObject)) {
    if (!PUBLIC_ENV_REGEX.test(env)) {
      delete envObject[env]
    }
  }
  envObject.MODE = mode
  envObject.NODE_ENV = mode
  return envObject
}

/**
 * Add import.meta.env support
 * Note: import.meta.url is not supported at this time
 */
module.exports = function () {
  const ast = template.ast(`
  ({env: ${JSON.stringify(generateEnvObject('test'))}})
`)
  return {
    visitor: {
      MetaProperty(path, state) {
        path.replaceWith(ast)
      },
    },
  }
}
