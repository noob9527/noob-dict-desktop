import React from 'react';
import styled from 'styled-components';
import { EcDictSearchSuccessResult } from '@noob9527/noob-dict-ecdict';
import { ThemedTooltip } from '../../themed-ui/tooltip/tooltip';
import { WordForm } from '@noob9527/noob-dict-core';

const ListContainer = styled.span`
`;
const ItemContainer = styled.span`
  margin-right: 10px;
`;

interface EcDictWordFormProp {
  item: [string, string | undefined]
}

interface EcDictWordFormListProp {
  className?: string
  result: EcDictSearchSuccessResult
}

export const EcDictWordForm: React.FC<EcDictWordFormProp> = (props: EcDictWordFormProp) => {
  const { item } = props;
  const [key, value] = item;
  const wordForm = WordForm.ofOrNull(key);
  if (!wordForm) return (<></>);
  let label: string = wordForm.description;
  switch (wordForm) {
    case WordForm.PAST:
      label = '过去式';
      break;
    case WordForm.PAST_PARTICIPLE:
      label = '过去分词';
      break;
    case WordForm.PRESENT_PARTICIPLE:
      label = '现在分词';
      break;
    case WordForm.THIRD_SINGULAR:
      label = '第三人称单数';
      break;
    case WordForm.PLURAL:
      label = '复数';
      break;
    case WordForm.LEMMA:
      label = '原型';
      break;
    case WordForm.COMPARATIVE:
      label = '比较级';
      break;
    case WordForm.SUPERLATIVE:
      label = '最高级';
      break;
  }
  return (
    <ItemContainer>
      <span>{label}: </span>
      <span>{value}</span>
    </ItemContainer>
  );
};

export const EcDictWordFormList: React.FC<EcDictWordFormListProp> = (props: EcDictWordFormListProp) => {
  const { result } = props;

  if (!Object.values(result.wordForms).length)
    return (<></>);

  const entries = Object.entries(result.wordForms);
  const tooltip = (
    <div>
      {entries.map((wordForm, i) => {
        return (
          <div key={i}><EcDictWordForm item={wordForm}/></div>
        );
      })}
    </div>
  );
  return (
    <ListContainer className={props.className}>
      <ThemedTooltip title={tooltip}>
        {entries.map((wordForm, i) => {
          return (
            <EcDictWordForm item={wordForm} key={i}/>
          );
        })}
        {/*<span>*/}
        {/*  <EcDictWordForm item={entries[0]}/>*/}
        {/*</span>*/}
      </ThemedTooltip>
    </ListContainer>
  );
};
