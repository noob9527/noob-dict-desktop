import React from 'react';
import { SearchResult } from "noob-dict-core";

interface CommonEngineViewProps {
  searchResult: SearchResult
}

const IframeEngineView: React.FC<CommonEngineViewProps> = (props: CommonEngineViewProps) => {
  const html = props.searchResult.html ?? '';
  return (
    <iframe width="100%" height="100%" frameBorder={0} srcDoc={html}/>
  );
};

export default IframeEngineView;
