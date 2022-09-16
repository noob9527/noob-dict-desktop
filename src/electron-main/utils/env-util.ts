import { machineId } from 'node-machine-id';

// https://github.com/automation-stack/node-machine-id
export function getClientAppId(): Promise<string> {
  return machineId(true);
}
