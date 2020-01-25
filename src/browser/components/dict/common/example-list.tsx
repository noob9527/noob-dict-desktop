import React from 'react';
import { Example, Language } from 'noob-dict-core';
import styled from 'styled-components';
import { Button, Icon, Tooltip } from 'antd';
import { ThemedTooltip } from '../../themed-ui/tooltip/tooltip';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { SearchNoteState } from '../../../pages/search/note/search-note-model';

const ItemContainer = styled.li`
  .anticon {
    margin-left: 8px;
  }
`;

const ListContainer = styled.ul`

`;

interface ExampleItemProp {
  example: Example
}

interface ExampleListProp {
  examples: Example[]
}

const ExampleItem: React.FC<ExampleItemProp> = (props: ExampleItemProp) => {
  const dispatch = useDispatch();
  const { example } = props;

  return (
    <ItemContainer>
      <div>
        <span>{example[Language.EN]}</span>
        <ThemedTooltip title={'save as context'}>
          <Button type="link" shape="circle" ghost onClick={() => {
            dispatch({
              type: 'searchNote/saveExampleToContext',
              payload: {
                paragraph: example[Language.EN],
              },
            });
          }}>
            <Icon type="file-add"/>
          </Button>
        </ThemedTooltip>
      </div>
      <div>{example[Language.ZH]}</div>
    </ItemContainer>
  );
};

const ExampleList: React.FC<ExampleListProp> = (props: ExampleListProp) => {
  const { examples } = props;
  return (
    <>
      <h4>Examples:</h4>
      <ListContainer>
        {examples.map((def, i) => (<ExampleItem example={def} key={i}/>))}
      </ListContainer>
    </>
  );
};

export default ExampleList;
