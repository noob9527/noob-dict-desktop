import * as path from 'path';

const assetsPath = 'assets';

export default function getAssetsPath(relativePath: string) {
  // note that __dirname will be evaluated to the build directory at runtime
  return path.join(__dirname, assetsPath, ...relativePath.split('/'));
}

