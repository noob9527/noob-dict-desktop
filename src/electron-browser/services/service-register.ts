import registerSearchService from './search-service-impl';
import registerSettingService from "./setting-service-impl";

export default function registerAllService() {
  registerSearchService();
  registerSettingService();
}