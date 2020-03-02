import React from 'react';
import { SearchResult, SearchResults } from '@noob9527/noob-dict-core';
import styled from 'styled-components';
import Title from '../common/title';
import ExampleList from '../common/example-list';
import PronunciationList from '../common/pronunciation-list';
import WordFormList from '../common/word-form-list';
import BingDefinitionList from './bing-definition-list';
import { ThemedEmpty } from '../../themed-ui/empty/empty';
import DoYouMeanGroup from '../common/do-you-mean-group';

const Container = styled.div`
`;

interface CommonEngineViewProps {
  result: SearchResult
}

const BingDict: React.FC<CommonEngineViewProps> = (props: CommonEngineViewProps) => {
  const { result } = props;

  if (SearchResults.isSuccessResult(result)) {
    const highlightWords = new Set([
      result.target,
      result.title!!,
      ...result.wordForms.map(e => e[1])
    ]);
    return (
      <Container>
        <Title>{result.title}</Title>
        <PronunciationList pronunciations={result.pronunciations}/>
        <BingDefinitionList definitions={result.definitions}/>
        <WordFormList wordForms={result.wordForms}/>
        <hr/>
        <ExampleList examples={result.examples} highlightWordSet={highlightWords}/>
      </Container>
    );
  } else if (SearchResults.isDoYouMeanResult(result)) {
    return (<DoYouMeanGroup target={result.target} doYouMeanItems={result.doYouMean}/>);
  } else {
    return (<ThemedEmpty/>);
  }
};

// https://reactjs.org/docs/react-api.html#reactmemo
export default React.memo(BingDict);