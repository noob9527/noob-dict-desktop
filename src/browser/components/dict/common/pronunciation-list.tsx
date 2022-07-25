import React from 'react';
import { Pronunciation, LanguageTag } from '@noob9527/noob-dict-core';
import styled from 'styled-components';
import Speaker from '../shared/speaker/speaker';
import { rendererContainer } from '../../../../common/container/renderer-container';
import { ClipboardService, ClipboardServiceToken } from '../../../../common/services/clipboard-service';
import ColorId from '../../../styles/ColorId';
import { ThemedTooltip } from '../../themed-ui/tooltip/tooltip';

const StyledSpan = styled.span`
  color: ${props => props.theme[ColorId.word_link]};
  cursor: pointer;
`;

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

const clipboardService = rendererContainer.get<ClipboardService>(ClipboardServiceToken);

const PronunciationItem: React.FC<PronunciationItemProps> = (props: PronunciationItemProps) => {
  const { pronunciation } = props;
  return (
    <ItemContainer>
      <span>{LanguageTag.getLabel(pronunciation.tag)}</span>
      <ThemedTooltip title="copy">
        <StyledSpan onClick={() => {
          if (pronunciation.phoneticSymbol) {
            clipboardService.writeClipboardText(pronunciation.phoneticSymbol);
          }
        }}>{pronunciation.phoneticSymbol}</StyledSpan>
      </ThemedTooltip>
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
