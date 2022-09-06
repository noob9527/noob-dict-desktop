import React from 'react';
import { Example, Language } from '@noob9527/noob-dict-core';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import ColorId from '../../../styles/ColorId';
import Highlight from '../shared/highlight/highlight';
import { CopyButton } from '../../themed-ui/button/copy-button';
import { rendererContainer } from '../../../../common/container/renderer-container';
import { ClipboardService, ClipboardServiceToken } from '../../../../common/services/clipboard-service';

const ItemContainer = styled.li`
  //margin-bottom: 8px;
  .ant-button {
    height: unset;
  }

  .anticon {
    color: ${props => props.theme[ColorId.word_link]};
  }
`;

const ListContainer = styled.ul`

`;

interface ExampleItemProp {
  example: Example
  highlightWords?: string[]
}

const clipboardService = rendererContainer.get<ClipboardService>(ClipboardServiceToken);

const ExampleItem: React.FC<ExampleItemProp> = (props: ExampleItemProp) => {
  const { example, highlightWords } = props;

  const en = example[Language.Constant.EN].sentence;
  const zh = example[Language.Constant.ZH].sentence;

  return (
    <ItemContainer>
      <div>
        <Highlight sentence={en} highlightWords={highlightWords}/>
        <CopyButton
          onClick={() => {
            clipboardService.writeClipboardText(en);
          }}
        />
      </div>
      <div>{zh}</div>
    </ItemContainer>
  );
};

interface ExampleListProp {
  examples: Example[]
  highlightWords?: string[]
}

const ExampleList: React.FC<ExampleListProp> = (props: ExampleListProp) => {
  const { examples, highlightWords } = props;
  if (examples.length===0) {
    return <></>;
  }
  return (
    <>
      <h4>Examples:</h4>
      <ListContainer>
        {examples.map((def, i) =>
          (<ExampleItem example={def} highlightWords={highlightWords} key={i}/>))
        }
      </ListContainer>
    </>
  );
};

export default ExampleList;
