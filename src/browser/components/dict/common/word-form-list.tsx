import React from 'react';
import { WordForm, WordFormToken } from '@noob9527/noob-dict-core';
import styled from 'styled-components';

const ItemContainer = styled.span`

`;
const ListContainer = styled.div`
  > span + span::before {
    content: ' | ';
  }
`;


interface WordFormItemProp {
  wordForm: WordForm
}
interface WordFormListProp {
  wordForms: WordForm[]
}

const WordFormItem: React.FC<WordFormItemProp> = (props: WordFormItemProp) => {
  const { wordForm } = props;
  return (
    <ItemContainer>
      <span>{WordFormToken.getLabel(wordForm[0])}: </span>
      <span>{wordForm[1]}</span>
    </ItemContainer>
  );
};
const WordFormList: React.FC<WordFormListProp> = (props: WordFormListProp) => {
  const { wordForms } = props;
  return (
    <ListContainer>
      {wordForms.map((def, i) => (<WordFormItem wordForm={def} key={i}/>))}
    </ListContainer>
  );
};

export default WordFormList;
