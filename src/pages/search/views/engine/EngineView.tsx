import React from 'react';
import { SearchResult } from 'noob-dict-core';

interface EngineViewProps {
  html: string
  searchResult: Maybe<SearchResult>
}

const EngineView: React.FC<EngineViewProps> = (props: EngineViewProps) => {
  const { html } = props;
  // const { searchResult } = props;
  return (
    <iframe width="100%" height="100%" frameBorder={0} srcDoc={html}/>
  );

  // if (!searchResult) {
  //   return (
  //     <div>no result</div>
  //   );
  // }
  //
  // return (
  //   <ReactJson src={searchResult.toJSON()}/>
  // );
};

export default EngineView;