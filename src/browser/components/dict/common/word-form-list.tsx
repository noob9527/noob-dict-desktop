import React from 'react';
import { WordForm } from '@noob9527/noob-dict-core';
import styled from 'styled-components';

const ItemContainer = styled.span`

`;
const ListContainer = styled.div`
  > span + span::before {
    content: ' | ';
  }
`;


interface WordFormItemProp {
  wordForm: string
  wordFormValue: string,
}
interface WordFormListProp {
  wordForms: WordForm.Data
}

const WordFormItem: React.FC<WordFormItemProp> = (props: WordFormItemProp) => {
  const { wordForm, wordFormValue } = props;
  let label: string;
  try {
    const wordFormEnum = WordForm.of(wordForm);
    label = wordFormEnum.description;
  } catch (e) {
    label = wordForm;
  }
  return (
    <ItemContainer>
      <span>{label}: </span>
      <span>{wordFormValue}</span>
    </ItemContainer>
  );
};
const WordFormList: React.FC<WordFormListProp> = (props: WordFormListProp) => {
  const { wordForms } = props;
  return (
    <ListContainer>
      {Object.entries(wordForms).map(([wordForm, value]) =>
        (<WordFormItem wordForm={wordForm} wordFormValue={value ?? ''} key={wordForm}/>)
      )}
    </ListContainer>
  );
};

export default WordFormList;
