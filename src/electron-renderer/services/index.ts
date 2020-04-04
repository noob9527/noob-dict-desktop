import { CorsSearchService, MockSearchService } from './search-service-impl';
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
import { NoteService, NoteServiceToken } from '../../common/services/db/note-service';
import { DexieNoteService } from './db/note-service-impl';
import { AppService, AppServiceToken } from '../../common/services/app-service';
import { ElectronAppService } from './app-service-impl';
import { UserService, UserServiceToken } from '../../common/services/user-service';
import { CorsUserService } from './user-service-impl';
import { LoginUiService, LoginUiServiceToken } from '../../common/services/login-ui-service';
import { ElectronLoginUiService } from './login-ui-service-impl';

function registerAllService() {
  rendererContainer.bind<ClipboardService>(ClipboardServiceToken).to(ClipboardServiceImpl);
  rendererContainer.bind<SearchService>(SearchServiceToken).to(CorsSearchService);
  rendererContainer.bind<SearchUiService>(SearchUiServiceToken).to(ElectronSearchUiService);
  rendererContainer.bind<SettingUiService>(SettingUiServiceToken).to(ElectronSettingUiService);
  rendererContainer.bind<SettingService>(SettingServiceToken).to(ElectronSettingService);
  rendererContainer.bind<PopupUiService>(PopupUiServiceToken).to(ElectronPopupUiService);
  rendererContainer.bind<WindowService>(WindowServiceToken).to(ElectronWindowService);
  rendererContainer.bind<AppService>(AppServiceToken).to(ElectronAppService);
  rendererContainer.bind<UserService>(UserServiceToken).to(CorsUserService);
  rendererContainer.bind<LoginUiService>(LoginUiServiceToken).to(ElectronLoginUiService);

  // db
  rendererContainer.bind<HistoryService>(HistoryServiceToken).to(DexieHistoryService);
  rendererContainer.bind<NoteService>(NoteServiceToken).to(DexieNoteService);
}

registerAllService();
