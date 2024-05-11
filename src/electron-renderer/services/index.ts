import { CorsSearchService } from './search-service-impl'
import { rendererContainer } from '../../common/container/renderer-container'
import {
  CorsSearchServiceToken,
  EcDictSearchServiceToken,
  SearchService,
} from '../../common/services/search-service'
import {
  SettingUiService,
  SettingUiServiceToken,
} from '../../common/services/setting-ui-service'
import { ElectronSettingUiService } from './setting-ui-service-impl'
import {
  HomeUiService,
  SearchUiServiceToken,
} from '../../common/services/home-ui-service'
import { ElectronHomeUiService } from './home-ui-service-impl'
import {
  PopupUiService,
  PopupUiServiceToken,
} from '../../common/services/popup-ui-service'
import { ElectronPopupUiService } from './popup-ui-service-impl'
import {
  WindowService,
  WindowServiceToken,
} from '../../common/services/window-service'
import { ElectronWindowService } from './window-service-impl'
import {
  SettingService,
  SettingServiceToken,
} from '../../common/services/setting-service'
import { ElectronSettingService } from './setting-service-impl'
import { ClipboardServiceImpl } from './clipboard-service-impl'
import {
  ClipboardService,
  ClipboardServiceToken,
} from '../../common/services/clipboard-service'
import {
  DexieHistoryServiceToken,
  HistoryService,
  LocalHistoryServiceToken,
} from '../../common/services/db/history-service'
import { DexieHistoryService } from './db/dexie/dexie-history-service'
import {
  DexieNoteServiceToken,
  LocalNoteServiceToken,
  NoteService,
} from '../../common/services/db/note-service'
import { DexieNoteService } from './db/dexie/dexie-note-service'
import { AppService, AppServiceToken } from '../../common/services/app-service'
import { ElectronAppService } from './app-service-impl'
import {
  UserService,
  UserServiceToken,
} from '../../common/services/user-service'
import { CorsUserService } from './user-service-impl'
import {
  LoginUiService,
  LoginUiServiceToken,
} from '../../common/services/login-ui-service'
import { ElectronLoginUiService } from './login-ui-service-impl'
import {
  GlobalHistoryService,
  GlobalHistoryServiceToken,
} from '../../common/services/global-history-service'
import {
  LocalStorageService,
  LocalStorageServiceToken,
} from '../../common/services/local-storage-service'
import { LocalStorageServiceImpl } from './local-storage-service-impl'
import { GlobalHistoryServiceImplV2 } from './global-history-service-impl-v2'
import { EcDictSearchService } from './ecdict-search-service'
import {
  LocalDbService,
  LocalDbServiceToken,
} from '../../common/services/db/local-db-service'
import { SqliteLocalDbService } from './db/sqlite/sqlite-local-db-service'
import { SqliteHistoryService } from './db/sqlite/sqlite-history-service'
import { SqliteNoteService } from './db/sqlite/sqlite-note-service'
import { type AxiosInstance } from 'axios'
import { ApiAxiosToken } from '../../common/services/api-service'
import { apiAxios } from '../utils/api-axios'
import { OpenAILLMServiceImpl } from './llm/openai-llm-service-impl'
import { GeminiLLMServiceImpl } from './llm/gemini-llm-service-impl'
import { FakeLLMServiceImpl } from './llm/fake-llm-service-impl'
import { RouterLLMServiceImpl } from './llm/router-llm-service-impl'
import {
  LLMService,
  RouterLLMServiceToken,
} from '../../common/services/llm/llm-service'
import { LLMProvider } from '../../common/services/llm/provider'
import { OllamaLLMServiceImpl } from './llm/ollama-llm-service-impl'

function registerAllService() {
  rendererContainer
    .bind<ClipboardService>(ClipboardServiceToken)
    .to(ClipboardServiceImpl)

  rendererContainer
    .bind<SearchService>(CorsSearchServiceToken)
    .to(CorsSearchService)
  rendererContainer
    .bind<SearchService>(EcDictSearchServiceToken)
    .to(EcDictSearchService)

  rendererContainer
    .bind<HomeUiService>(SearchUiServiceToken)
    .to(ElectronHomeUiService)
  rendererContainer
    .bind<SettingUiService>(SettingUiServiceToken)
    .to(ElectronSettingUiService)
  rendererContainer
    .bind<SettingService>(SettingServiceToken)
    .to(ElectronSettingService)
  rendererContainer
    .bind<PopupUiService>(PopupUiServiceToken)
    .to(ElectronPopupUiService)
  rendererContainer
    .bind<WindowService>(WindowServiceToken)
    .to(ElectronWindowService)
  rendererContainer.bind<AppService>(AppServiceToken).to(ElectronAppService)
  rendererContainer.bind<UserService>(UserServiceToken).to(CorsUserService)
  rendererContainer
    .bind<LoginUiService>(LoginUiServiceToken)
    .to(ElectronLoginUiService)
  rendererContainer
    .bind<GlobalHistoryService>(GlobalHistoryServiceToken)
    .to(GlobalHistoryServiceImplV2)
  rendererContainer
    .bind<LocalStorageService>(LocalStorageServiceToken)
    .to(LocalStorageServiceImpl)

  // db dexie
  rendererContainer
    .bind<HistoryService>(DexieHistoryServiceToken)
    .to(DexieHistoryService)
  rendererContainer
    .bind<NoteService>(DexieNoteServiceToken)
    .to(DexieNoteService)

  // db sqlite
  rendererContainer
    .bind<LocalDbService>(LocalDbServiceToken)
    .to(SqliteLocalDbService)
  rendererContainer
    .bind<HistoryService>(LocalHistoryServiceToken)
    .to(SqliteHistoryService)
  rendererContainer
    .bind<NoteService>(LocalNoteServiceToken)
    .to(SqliteNoteService)

  rendererContainer.bind<AxiosInstance>(ApiAxiosToken).toConstantValue(apiAxios)

  // llm
  rendererContainer
    .bind<LLMService>(LLMProvider.OPEN_AI.serviceToken)
    .to(OpenAILLMServiceImpl)
  rendererContainer
    .bind<LLMService>(LLMProvider.GEMINI.serviceToken)
    .to(GeminiLLMServiceImpl)
  rendererContainer
    .bind<LLMService>(LLMProvider.OLLAMA.serviceToken)
    .to(OllamaLLMServiceImpl)
  rendererContainer
    .bind<LLMService>(LLMProvider.FAKE.serviceToken)
    .to(FakeLLMServiceImpl)
  rendererContainer
    .bind<LLMService>(RouterLLMServiceToken)
    .to(RouterLLMServiceImpl)
}

registerAllService();
