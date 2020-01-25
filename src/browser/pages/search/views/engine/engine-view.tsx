import React from 'react';
import { EngineIdentifier, SearchJsonResult, SearchResult } from 'noob-dict-core';
import { useParams } from 'react-router-dom';
import { SearchPanelState } from '../../panel/search-panel-model';
import { useSelector } from 'react-redux';
import CommonEngineView from '../../../../components/dict/common/common-dict';
import BingDict from '../../../../components/dict/bing/bing-dict';
import { ThemedEmpty } from '../../../../components/themed-ui/empty/empty';

interface EngineViewProps {
  html: string
  searchResult: Maybe<SearchResult>
}

const EngineView: React.FC<EngineViewProps> = (props: EngineViewProps) => {
  const engine: EngineIdentifier = (useParams() as any).engine;
  const state: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const result = state.searchResults[engine];

  return (
    <>{getDictComponent(result)}</>
  );

  // noinspection JSRedundantSwitchStatement
  // switch (result.engine) {
  //   case EngineIdentifier.BING:
  //     return <BingDict searchResult={result}/>;
  //   default:
  //     return <CommonEngineView searchResult={result}/>;
  // }
};

function getDictComponent(result: SearchJsonResult | null | undefined) {
  if (!result) return (<ThemedEmpty/>);
  // noinspection JSRedundantSwitchStatement
  switch (result.engine) {
    case EngineIdentifier.BING:
      return <BingDict searchResult={result}/>;
    default:
      return <CommonEngineView searchResult={result}/>;
  }
}

export default EngineView;