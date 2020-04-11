import React from 'react';
import { SearchResult } from '@noob9527/noob-dict-core';

interface CommonEngineViewProps {
  search_result: SearchResult
}

const IframeEngineView: React.FC<CommonEngineViewProps> = (props: CommonEngineViewProps) => {
  return <></>;
  // const html = props.search_result.html ?? '';
  // return (
  //   <iframe width="100%" height="100%" frameBorder={0} srcDoc={html}/>
  // );
};

export default IframeEngineView;
