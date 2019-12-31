import React from 'react';
import { SearchResult } from 'noob-dict-core';
import DefinitionList from './definition-list';
import styled from 'styled-components';
import Title from './title';


const Container = styled.div`
`;

interface CommonEngineListProps {
  searchResult: SearchResult
}

const CommonDict: React.FC<CommonEngineListProps> = (props: CommonEngineListProps) => {
  const { searchResult } = props;
  return (
    <Container>
      <Title>{searchResult.title}</Title>
      <DefinitionList definitions={searchResult.definitions}/>
    </Container>
  );
};

export default CommonDict;