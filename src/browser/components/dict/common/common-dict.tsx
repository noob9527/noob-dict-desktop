import React from 'react';
import { SearchResult, SearchResults } from '@noob9527/noob-dict-core';
import DefinitionList from './definition-list';
import styled from 'styled-components';
import Title from './title';
import { ThemedEmpty } from '../../themed-ui/empty/empty';
import DoYouMeanGroup from './do-you-mean-group';


const Container = styled.div`
`;

interface CommonEngineListProps {
  result: SearchResult
}

const CommonDict: React.FC<CommonEngineListProps> = (props: CommonEngineListProps) => {
  const { result } = props;

  if (SearchResults.isSuccessResult(result)) {
    return (
      <Container>
        <Title>{result.title}</Title>
        <DefinitionList definitions={result.definitions}/>
      </Container>
    );
  } else if (SearchResults.isDoYouMeanResult(result)) {
    return (<DoYouMeanGroup target={result.target} doYouMeanItems={result.doYouMean}/>);
  } else {
    return (<ThemedEmpty/>);
  }
};

// https://reactjs.org/docs/react-api.html#reactmemo
export default React.memo(CommonDict);