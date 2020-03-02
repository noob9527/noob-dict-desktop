import React from 'react';
import { Meaning } from '@noob9527/noob-dict-core';
import styled from 'styled-components';

const ItemContainer = styled.li`

`;

const ListContainer = styled.ul`

`;

interface MeaningItemProp {
  meaning: Meaning
}

interface MeaningListProp {
  meanings: Meaning[]
}

const MeaningItem: React.FC<MeaningItemProp> = (props: MeaningItemProp) => {
  const { meaning } = props;
  return (
    <ItemContainer>
      <div>{meaning.EN}</div>
      <div>{meaning.ZH}</div>
    </ItemContainer>
  );
};

const MeaningList: React.FC<MeaningListProp> = (props: MeaningListProp) => {
  const { meanings } = props;
  return (
    <>
      <h4>Meanings:</h4>
      <ListContainer>
        {meanings.map((def, i) => (<MeaningItem meaning={def} key={i}/>))}
      </ListContainer>
    </>
  );
};

export default MeaningList;
