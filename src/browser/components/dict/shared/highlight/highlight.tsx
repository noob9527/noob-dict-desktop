import React from 'react';
import styled from 'styled-components';

// todo
const Sentence = styled.p`

`;

interface HighlightProp {
  sentence: string
  // array of [startIndex, endIndex]
  posList?: [number, number][]
  words?: Set<String>
}

interface PosHighlightProp {
  sentence: string
  pos: [number, number][]
}

interface WordHighlightProp {
  sentence: string
  words: Set<string>
}

const PosHighlight = (props) => {
  const { sentence } = props;
  return <Sentence>{sentence}</Sentence>;
};

const WordHighlight = (props) => {
  const { sentence } = props;
  return <Sentence>{sentence}</Sentence>;
};

const Highlight: React.FC<HighlightProp> = (props) => {
  const { posList, words, sentence } = props;

  if (posList && posList.length)
    return <PosHighlight {...props}/>;

  if (words && words.size)
    return <WordHighlight {...props}/>;

  return <Sentence>{sentence}</Sentence>;
};

export default Highlight;