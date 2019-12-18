import { MockSearchService } from './search-service-impl';
import { rendererContainer } from '../../browser/services/renderer-container';
import { SearchService, searchServiceToken } from '../../browser/services/search-service';

export default function registerAllService() {
  rendererContainer.bind<SearchService>(searchServiceToken).to(MockSearchService);
}