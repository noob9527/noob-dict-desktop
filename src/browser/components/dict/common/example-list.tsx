import React from 'react';
import { Example, Language } from 'noob-dict-core';
import styled from 'styled-components';

const ItemContainer = styled.li`

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
  const { example } = props;
  return (
    <ItemContainer>
      <div>{example[Language.EN]}</div>
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
