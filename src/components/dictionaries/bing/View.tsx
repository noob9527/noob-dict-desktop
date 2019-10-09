import React from 'react';
import { SearchResult } from 'noob-dict-core';

export const BingView: React.FC<{
  result: SearchResult,
  definitionElements: string[]
}> = ({ result, definitionElements }) => {
  return (
    <>
      {definitionElements.map(e => <div dangerouslySetInnerHTML={{ __html: e }}/>)}
    </>
  );
};