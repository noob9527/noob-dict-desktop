import React from 'react';
import { SearchResult, EngineIdentifier } from 'noob-dict-core';
import { useParams } from 'react-router-dom';
import { SearchPanelState } from '../../panel/search-panel-model';
import { useSelector } from 'react-redux';
import CommonEngineView from './common-engine-view';
import IframeEngineView from './iframe-engine-view';

interface EngineViewProps {
  html: string
  searchResult: Maybe<SearchResult>
}

const EngineView: React.FC<EngineViewProps> = (props: EngineViewProps) => {
  const engine: EngineIdentifier = (useParams() as any).engine;
  const state: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const result = state.searchResults[engine];

  if (!result) return <div>empty result</div>;

  return (
    <>
      {/*<CommonEngineView searchResult={result}/>*/}
      <IframeEngineView searchResult={result}/>
    </>
  );

};

export default EngineView;