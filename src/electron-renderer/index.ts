// for dependency injection
import 'reflect-metadata';
import './services';
import '../browser/index';
import { Env } from '../electron-shared/env';
import logger from '../electron-shared/logger';

// verify env
logger.debug('REACT_APP_ENV_LOAD_FLAG', Env.REACT_APP_ENV_LOAD_FLAG);
if(!Env.REACT_APP_ENV_LOAD_FLAG) {
  throw new Error('failed to load env');
}

postMessage({ payload: 'removeLoading' }, '*')
