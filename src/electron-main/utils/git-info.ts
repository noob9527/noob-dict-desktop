import { Env } from '../../electron-shared/env'

const gitInfo = {
  version: Env.REACT_APP_GIT_COMMIT_HASH_SHORT,
  commitHash: Env.REACT_APP_GIT_COMMIT_HASH,
  // historically, we read git info from build folder.
  // version: fs.readFileSync(getBuildPath('VERSION'), 'utf8'),
  // commitHash: fs.readFileSync(getBuildPath('COMMITHASH'), 'utf8'),
}

// mount to global set that renderer can access it via remote.getGlobal("gitInfo")
// https://www.electronjs.org/docs/api/remote
;(global as any).gitInfo = gitInfo

export default gitInfo
