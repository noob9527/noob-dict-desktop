import React from 'react';
import { Pronunciation, LanguageTag } from '@noob9527/noob-dict-core';
import styled from 'styled-components';
import Speaker from '../shared/speaker/speaker';

const ItemContainer = styled.span`
  > span + span {
    margin-left: 5px;
  }
`;
const ListContainer = styled.div`
  > span + span {
    margin-left: 15px;
  }
`;

interface PronunciationItemProps {
  pronunciation: Pronunciation
}

interface PronunciationListProps {
  pronunciations: Pronunciation[]
}

const PronunciationItem: React.FC<PronunciationItemProps> = (props: PronunciationItemProps) => {
  const { pronunciation } = props;
  return (
    <ItemContainer>
      <span>{LanguageTag.getLabel(pronunciation.tag)}</span>
      <span>{pronunciation.phoneticSymbol}</span>
      <Speaker src={pronunciation.audio ?? undefined}/>
    </ItemContainer>
  );
};

const PronunciationList: React.FC<PronunciationListProps> = (props: PronunciationListProps) => {
  const { pronunciations } = props;
  return (
    <ListContainer>
      {pronunciations.map((prop, i) => (
        <PronunciationItem pronunciation={prop} key={i}/>
      ))}
    </ListContainer>
  );
};

export default PronunciationList;