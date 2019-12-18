import { MockSearchService } from './search-service-impl';
import { rendererContainer } from '../../common/container/renderer-container';
import { SearchService, SearchServiceToken } from '../../browser/services/search-service';
import { SettingUiService, SettingUiServiceToken } from '../../browser/services/setting-ui-service';
import { ElectronSettingUiService } from './setting-ui-service-impl';
import { SearchUiService, SearchUiServiceToken } from '../../browser/services/search-ui-service';
import { ElectronSearchUiService } from './search-ui-service-impl';

function registerAllService() {
  rendererContainer.bind<SearchService>(SearchServiceToken).to(MockSearchService);
  rendererContainer.bind<SearchUiService>(SearchUiServiceToken).to(ElectronSearchUiService);
  rendererContainer.bind<SettingUiService>(SettingUiServiceToken).to(ElectronSettingUiService);
}

registerAllService();
