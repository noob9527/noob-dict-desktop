import { MockSearchService } from './search-service-impl';
import { rendererContainer } from '../../common/container/renderer-container';
import { SearchService, SearchServiceToken } from '../../common/services/search-service';
import { SettingUiService, SettingUiServiceToken } from '../../common/services/setting-ui-service';
import { ElectronSettingUiService } from './setting-ui-service-impl';
import { SearchUiService, SearchUiServiceToken } from '../../common/services/search-ui-service';
import { ElectronSearchUiService } from './search-ui-service-impl';
import { PopupUiService, PopupUiServiceToken } from '../../common/services/popup-ui-service';
import { ElectronPopupUiService } from './popup-ui-service-impl';
import { WindowService, WindowServiceToken } from '../../common/services/window-service';
import { ElectronWindowService } from './window-service-impl';
import { SettingService, SettingServiceToken } from '../../common/services/setting-service';
import { ElectronSettingService } from './setting-service-impl';
import { ClipboardServiceImpl } from './clipboard-service-impl';
import { ClipboardService, ClipboardServiceToken } from '../../common/services/clipboard-service';
import { HistoryService, HistoryServiceToken } from '../../common/services/db/history-service';
import { DexieHistoryService } from './db/history-service-impl';

function registerAllService() {
  rendererContainer.bind<ClipboardService>(ClipboardServiceToken).to(ClipboardServiceImpl);
  rendererContainer.bind<SearchService>(SearchServiceToken).to(MockSearchService);
  rendererContainer.bind<SearchUiService>(SearchUiServiceToken).to(ElectronSearchUiService);
  rendererContainer.bind<SettingUiService>(SettingUiServiceToken).to(ElectronSettingUiService);
  rendererContainer.bind<SettingService>(SettingServiceToken).to(ElectronSettingService);
  rendererContainer.bind<PopupUiService>(PopupUiServiceToken).to(ElectronPopupUiService);
  rendererContainer.bind<WindowService>(WindowServiceToken).to(ElectronWindowService);

  // db
  rendererContainer.bind<HistoryService>(HistoryServiceToken).to(DexieHistoryService);
}

registerAllService();
