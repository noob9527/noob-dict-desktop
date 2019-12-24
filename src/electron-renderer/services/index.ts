import { MockSearchService } from './search-service-impl';
import { rendererContainer } from '../../common/container/renderer-container';
import { SearchService, SearchServiceToken } from '../../browser/services/search-service';
import { SettingUiService, SettingUiServiceToken } from '../../browser/services/setting-ui-service';
import { ElectronSettingUiService } from './setting-ui-service-impl';
import { SearchUiService, SearchUiServiceToken } from '../../browser/services/search-ui-service';
import { ElectronSearchUiService } from './search-ui-service-impl';
import { PopupUiService, PopupUiServiceToken } from '../../browser/services/popup-ui-service';
import { ElectronPopupUiService } from './popup-ui-service-impl';
import { SettingStorageService, SettingStorageServiceToken } from '../../browser/services/setting-storage-service';
import { ElectronSettingStorageService } from './setting-storage-service-impl';
import { WindowService, WindowServiceToken } from '../../browser/services/window-service';
import { ElectronWindowService } from './window-service-impl';

function registerAllService() {
  rendererContainer.bind<SearchService>(SearchServiceToken).to(MockSearchService);
  rendererContainer.bind<SearchUiService>(SearchUiServiceToken).to(ElectronSearchUiService);
  rendererContainer.bind<SettingUiService>(SettingUiServiceToken).to(ElectronSettingUiService);
  rendererContainer.bind<SettingStorageService>(SettingStorageServiceToken).to(ElectronSettingStorageService);
  rendererContainer.bind<PopupUiService>(PopupUiServiceToken).to(ElectronPopupUiService);
  rendererContainer.bind<WindowService>(WindowServiceToken).to(ElectronWindowService);
}

registerAllService();
