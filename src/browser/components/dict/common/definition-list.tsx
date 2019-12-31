import React from 'react';
import { Definition } from 'noob-dict-core';
import styled from 'styled-components';
import PronunciationList from './pronunciation-list';
import WordFormList from './word-form-list';
import MeaningList from './meaning-list';
import ExampleList from './example-list';

const ListContainer = styled.div`

`;

const ItemContainer = styled.div`

`;


interface DefinitionListProp {
  definitions: Definition[]
}

interface DefinitionItemProp {
  definition: Definition
}

const DefinitionItem: React.FC<DefinitionItemProp> = (props: DefinitionItemProp) => {
  const { definition } = props;
  return (
    <ItemContainer>
      <span>{definition.partOfSpeech}</span>
      <PronunciationList pronunciations={definition.pronunciations}/>
      <WordFormList wordForms={definition.wordForms}/>
      <MeaningList meanings={definition.meanings}/>
      <ExampleList examples={definition.examples}/>
      <hr/>
    </ItemContainer>
  );
};

const DefinitionList: React.FC<DefinitionListProp> = (props: DefinitionListProp) => {
  const { definitions } = props;
  return (
    <ListContainer>
      {definitions.map((def, i) => (<DefinitionItem definition={def} key={i}/>))}
    </ListContainer>
  );
};

export default DefinitionList;
