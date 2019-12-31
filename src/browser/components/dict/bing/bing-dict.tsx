import React from 'react';
import { SearchResult } from 'noob-dict-core';
import styled from 'styled-components';
import Title from '../common/title';
import ExampleList from '../common/example-list';
import PronunciationList from '../common/pronunciation-list';
import WordFormList from '../common/word-form-list';
import BingDefinitionList from './bing-definition-list';

const Container = styled.div`
`;

interface CommonEngineViewProps {
  searchResult: SearchResult
}

const BingDict: React.FC<CommonEngineViewProps> = (props: CommonEngineViewProps) => {
  const { searchResult } = props;
  return (
    <Container>
      <Title>{searchResult.title}</Title>
      <PronunciationList pronunciations={searchResult.pronunciations}/>
      <BingDefinitionList definitions={searchResult.definitions}/>
      <WordFormList wordForms={searchResult.wordForms}/>
      <hr/>
      <ExampleList examples={searchResult.examples}/>
    </Container>
  );
};

export default BingDict;