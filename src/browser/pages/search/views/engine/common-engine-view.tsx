import React from 'react';
import { SearchResult } from "noob-dict-core";

interface CommonEngineViewProps {
  searchResult: SearchResult
}

const CommonEngineView: React.FC<CommonEngineViewProps> = (props: CommonEngineViewProps) => {
  const { searchResult } = props;
  return (
    <div>
      common engine view
      <div>{searchResult.title}</div>
    </div>
  );
};

export default CommonEngineView;