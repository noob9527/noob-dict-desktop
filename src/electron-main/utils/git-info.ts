import * as fs from 'fs';
import { getBuildPath } from './path-util';

const gitInfo = {
  version: fs.readFileSync(getBuildPath('VERSION'), 'utf8'),
  commitHash: fs.readFileSync(getBuildPath('COMMITHASH'), 'utf8'),
};

// mount to global set that renderer can access it via remote.getGlobal("gitInfo")
// https://www.electronjs.org/docs/api/remote
(global as any).gitInfo = gitInfo;

export default gitInfo;
