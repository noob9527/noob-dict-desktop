import React from 'react';
import { Definition, PartOfSpeech } from '@noob9527/noob-dict-core';
import styled from 'styled-components';
import BingMeaningList from './bing-meaning-list';

const ListContainer = styled.div`

`;

const ItemContainer = styled.div`
  > span + span {
    margin-left: 5px;
  }
`;


interface BingDefinitionListProp {
  definitions: Definition[]
}

interface BingDefinitionItemProp {
  definition: Definition
}

const BingDefinitionItem: React.FC<BingDefinitionItemProp> = (props: BingDefinitionItemProp) => {
  const { definition } = props;

  const posLabel = PartOfSpeech
      .ofOrNull(definition.partOfSpeech ?? '')?.symbols[0]
    ?? definition.partOfSpeech
  return (
    <ItemContainer>
      <span>{posLabel}</span>
      <BingMeaningList meanings={definition.meanings}/>
    </ItemContainer>
  );
};

const BingDefinitionList: React.FC<BingDefinitionListProp> = (props: BingDefinitionListProp) => {
  const { definitions } = props;
  return (
    <>
      <ListContainer>
        {definitions.map((def, i) => (<BingDefinitionItem definition={def} key={i}/>))}
      </ListContainer>
    </>
  );
};

export default BingDefinitionList;
