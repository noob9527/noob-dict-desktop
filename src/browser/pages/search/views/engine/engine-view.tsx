import React from 'react';
import { useParams } from 'react-router-dom';
import { SearchPanelState } from '../../panel/search-panel-model';
import { useSelector } from 'react-redux';
import CommonEngineView from '../../../../components/dict/common/common-dict';
import BingDict from '../../../../components/dict/bing/bing-dict';
import { ThemedEmpty } from '../../../../components/themed-ui/empty/empty';
import { NetworkEngineId } from '@noob9527/noob-dict-net-engines';


const EngineView: React.FC = () => {
  const state: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const engine: NetworkEngineId = (useParams() as any).engine
    ?? state.primaryResult?.engine
    ?? NetworkEngineId.BING;
  const result = state.searchResultMap[engine];

  if (!result) return (<ThemedEmpty/>);

  // noinspection JSRedundantSwitchStatement
  switch (result.engine) {
    case NetworkEngineId.BING:
      return <BingDict result={result} highlightWords={state.highlightWords}/>;
    default:
      return <CommonEngineView result={result} highlightWords={state.highlightWords}/>;
  }
};

export default EngineView;
