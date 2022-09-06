import React from 'react';
import styled from 'styled-components';

const ItemContainer = styled.span`
  display: inline;
  border: 1px solid gray;
  padding: 2px 5px;
  margin: 2px 4px;
  height: 100%;
`;

const ListContainer = styled.span`

`;


interface EcDictTagItemProp {
  item: string
}

interface EcDictTagListProp {
  items: string[]
  className?: string
}

export const EcDictTagItem: React.FC<EcDictTagItemProp> = (props: EcDictTagItemProp) => {
  const { item } = props;
  let label: string;
  switch (item) {
    case '四级':
      label = 'CET4';
      break;
    case '六级':
      label = 'CET6';
      break;
    case '雅思':
      label = 'IELTS';
      break;
    default:
      label = item;
  }
  return (
    <ItemContainer>
      {label}
    </ItemContainer>
  );
};

export const EcDictTagList: React.FC<EcDictTagListProp> = (props: EcDictTagListProp) => {
  const { items } = props;
  return (
    <ListContainer className={props.className}>
      {items.map((tag, i) => (<EcDictTagItem item={tag} key={i}/>))}
    </ListContainer>
  );
};


