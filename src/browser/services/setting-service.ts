import { container } from "tsyringe";

export class SettingService {
  openSettingWindow(): Promise<boolean> {
    throw new Error();
  }
}

export {
  openSettingWindow
};

async function openSettingWindow() {
  const settingService = container.resolve(SettingService);
  return settingService.openSettingWindow();
}