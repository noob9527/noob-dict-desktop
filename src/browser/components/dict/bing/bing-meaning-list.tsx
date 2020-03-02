import React from 'react';
import { Meaning } from '@noob9527/noob-dict-core';
import styled from 'styled-components';

const ItemContainer = styled.span`

`;

const ListContainer = styled.span`

`;

interface BingMeaningItemProp {
  meaning: Meaning
}

interface BingMeaningListProp {
  meanings: Meaning[]
}

const BingMeaningItem: React.FC<BingMeaningItemProp> = (props: BingMeaningItemProp) => {
  const { meaning } = props;
  return (
    <ItemContainer>
      <span>{meaning.EN}</span>
      <span>{meaning.ZH}</span>
    </ItemContainer>
  );
};

const BingMeaningList: React.FC<BingMeaningListProp> = (props: BingMeaningListProp) => {
  const { meanings } = props;
  return (
    <>
      <ListContainer>
        {meanings.map((def, i) => (<BingMeaningItem meaning={def} key={i}/>))}
      </ListContainer>
    </>
  );
};

export default BingMeaningList;

