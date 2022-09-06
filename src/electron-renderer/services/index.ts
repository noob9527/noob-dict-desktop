import { CorsSearchService, MockSearchService } from './search-service-impl';
import { rendererContainer } from '../../common/container/renderer-container';
import { SearchService, CorsSearchServiceToken, EcDictSearchServiceToken } from '../../common/services/search-service';
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
import { DexieHistoryService } from './db/dexie/dexie-history-service';
import { NoteService, NoteServiceToken } from '../../common/services/db/note-service';
import { DexieNoteService } from './db/dexie/dexie-note-service';
import { AppService, AppServiceToken } from '../../common/services/app-service';
import { ElectronAppService } from './app-service-impl';
import { UserService, UserServiceToken } from '../../common/services/user-service';
import { CorsUserService } from './user-service-impl';
import { LoginUiService, LoginUiServiceToken } from '../../common/services/login-ui-service';
import { ElectronLoginUiService } from './login-ui-service-impl';
import { GlobalHistoryService, GlobalHistoryServiceToken } from '../../common/services/global-history-service';
import { LocalStorageService, LocalStorageServiceToken } from '../../common/services/local-storage-service';
import { LocalStorageServiceImpl } from './local-storage-service-impl';
import { GlobalHistoryServiceImplV2 } from './global-history-service-impl-v2';
import { EcDictSearchService } from './ecdict-search-service';

function registerAllService() {
  rendererContainer.bind<ClipboardService>(ClipboardServiceToken).to(ClipboardServiceImpl);

  rendererContainer.bind<SearchService>(CorsSearchServiceToken).to(CorsSearchService);
  rendererContainer.bind<SearchService>(EcDictSearchServiceToken).to(EcDictSearchService);

  rendererContainer.bind<SearchUiService>(SearchUiServiceToken).to(ElectronSearchUiService);
  rendererContainer.bind<SettingUiService>(SettingUiServiceToken).to(ElectronSettingUiService);
  rendererContainer.bind<SettingService>(SettingServiceToken).to(ElectronSettingService);
  rendererContainer.bind<PopupUiService>(PopupUiServiceToken).to(ElectronPopupUiService);
  rendererContainer.bind<WindowService>(WindowServiceToken).to(ElectronWindowService);
  rendererContainer.bind<AppService>(AppServiceToken).to(ElectronAppService);
  rendererContainer.bind<UserService>(UserServiceToken).to(CorsUserService);
  rendererContainer.bind<LoginUiService>(LoginUiServiceToken).to(ElectronLoginUiService);
  rendererContainer.bind<GlobalHistoryService>(GlobalHistoryServiceToken).to(GlobalHistoryServiceImplV2);
  rendererContainer.bind<LocalStorageService>(LocalStorageServiceToken).to(LocalStorageServiceImpl);

  // db
  rendererContainer.bind<HistoryService>(HistoryServiceToken).to(DexieHistoryService);
  rendererContainer.bind<NoteService>(NoteServiceToken).to(DexieNoteService);
}

registerAllService();
