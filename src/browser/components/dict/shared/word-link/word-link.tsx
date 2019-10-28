import React from 'react';
import styled from 'styled-components';
import ColorId from '../../../../styles/ColorId';
import { useDispatch } from 'react-redux';

const StyledWordLink = styled.span`
  color: ${props => props.theme[ColorId.word_link]};
  cursor: pointer;
`;

interface WordLinkProps {
  word: string
}

const WordLink: React.FC<WordLinkProps> = (props) => {
  const { word } = props;
  const dispatch = useDispatch();
  return <StyledWordLink
    onClick={() => {
      dispatch({
        type: 'search/search',
        payload: {
          text: word,
        },
      });
    }}
  >{word}</StyledWordLink>;
};

export default WordLink;