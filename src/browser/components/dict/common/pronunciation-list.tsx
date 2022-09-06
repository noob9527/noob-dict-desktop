import React from 'react';
import { Pronunciation, LanguageTag } from '@noob9527/noob-dict-core';
import styled from 'styled-components';
import Speaker from '../shared/speaker/speaker';
import { rendererContainer } from '../../../../common/container/renderer-container';
import { ClipboardService, ClipboardServiceToken } from '../../../../common/services/clipboard-service';
import { ThemedTooltip } from '../../themed-ui/tooltip/tooltip';
import { InteractiveText } from '../../themed-ui/content/interactive-text/interactive-text';

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
  let label: string;
  switch(pronunciation.tag) {
    case LanguageTag.Constant.EN_GB:
      label = '英'
      break;
    case LanguageTag.Constant.EN_US:
      label = '美'
      break;
    case LanguageTag.Constant.ZH_CN:
      label = '中'
      break;
    default:
      label = 'UNKNOWN'
  }
  return (
    <ItemContainer>
      <span>{label}</span>
      <ThemedTooltip title="copy">
        <InteractiveText onClick={() => {
          if (pronunciation.phoneticSymbol) {
            clipboardService.writeClipboardText(pronunciation.phoneticSymbol);
          }
        }}>{pronunciation.phoneticSymbol}</InteractiveText>
      </ThemedTooltip>
      {pronunciation.audio ? (<Speaker src={pronunciation.audio}/>) : null}
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
