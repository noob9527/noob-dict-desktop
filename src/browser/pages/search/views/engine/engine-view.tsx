import React from 'react';
import { EngineIdentifier } from 'noob-dict-core';
import { useParams } from 'react-router-dom';
import { SearchPanelState } from '../../panel/search-panel-model';
import { useSelector } from 'react-redux';
import CommonEngineView from '../../../../components/dict/common/common-dict';
import BingDict from '../../../../components/dict/bing/bing-dict';
import { ThemedEmpty } from '../../../../components/themed-ui/empty/empty';


const EngineView: React.FC = () => {
  const engine: EngineIdentifier = (useParams() as any).engine;
  const state: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const result = state.searchResultMap[engine];

  if (!result) return (<ThemedEmpty/>);

  // noinspection JSRedundantSwitchStatement
  switch (result.engine) {
    case EngineIdentifier.BING:
      return <BingDict result={result}/>;
    default:
      return <CommonEngineView result={result}/>;
  }
};

export default EngineView;