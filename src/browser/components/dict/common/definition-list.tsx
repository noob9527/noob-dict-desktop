import React from 'react';
import { Definition, PartOfSpeech } from '@noob9527/noob-dict-core';
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
  highlightWords: string[]
}

interface DefinitionItemProp {
  definition: Definition
  highlightWords: string[]
}

const DefinitionItem: React.FC<DefinitionItemProp> = (props: DefinitionItemProp) => {
  const { definition, highlightWords } = props;

  const posLabel = PartOfSpeech
    .ofOrNull(definition.partOfSpeech ?? '')?.symbols[0]
    ?? definition.partOfSpeech
  return (
    <ItemContainer>
      <span>{posLabel}</span>
      <PronunciationList pronunciations={definition.pronunciations}/>
      <WordFormList wordForms={definition.wordForms}/>
      <MeaningList meanings={definition.meanings}/>
      <ExampleList examples={definition.examples} highlightWords={highlightWords}/>
    </ItemContainer>
  );
};

const DefinitionList: React.FC<DefinitionListProp> = (props: DefinitionListProp) => {
  const { definitions, highlightWords } = props;
  return (
    <ListContainer>
      {definitions.map((def, i) =>
        (
          <div key={i}>
            <DefinitionItem definition={def} key={i} highlightWords={highlightWords}/>
            {i < definitions.length - 1 ? <hr/> : null}
          </div>
        ),
      )}
    </ListContainer>
  );
};

export default DefinitionList;
