import * as Core from "noob-dict-core";

export {
  fetchSuggests,
  fetchResult,
  fetchHtml,
};

async function fetchSuggests(text: string): Promise<Core.Suggest[]> {
  return Core.getSuggests(text);
}

async function fetchResult(text: string, engine: Core.EngineIdentifier): Promise<Core.SearchResult> {
  const instance = Core.getEngineInstance(engine);
  return instance.search(text);
}

async function fetchHtml(text: string, engine: Core.EngineIdentifier): Promise<string> {
  const instance = Core.getEngineInstance(engine);
  const parser = instance.parser;
  const document = await instance.getDocument(text);
  const dE =  parser.getDefinitionElements(document);
  return dE.map(e => e.outerHTML).join('');
}
