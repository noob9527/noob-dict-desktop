import React from 'react';
import styled from 'styled-components';
import ColorId from '../../../../styles/ColorId';
import Highlighter from 'react-highlight-words';
import { findHighlightWordPos } from '../../../../../common/utils/find-highlight-word-pos';

const Sentence = styled.span`
`;

const NormalSpan = styled.span`

`;

const HighlightSpan = styled.span`
  color: ${props => props.theme[ColorId.word_highlight]};
`;

interface HighlightProp {
  sentence: string
  // array of [startIndex, endIndex]
  posList?: [number, number][]
  highlightWords?: string[]
}

interface PosHighlightProp {
  sentence: string
  posList: [number, number][]
}

interface WordHighlightProp {
  sentence: string
  highlightWords: string[]
}

const PosHighlight: React.FC<PosHighlightProp> = (props) => {
  const { sentence, posList } = props;

  return (
    <Highlighter
      searchWords={[]}
      textToHighlight={sentence}
      highlightTag={({ children }) => (<HighlightSpan>{children}</HighlightSpan>)}
      findChunks={() => {
        return posList.map(([start, end]) => ({ start, end }));
      }}
    />
  );
};

const WordHighlight: React.FC<WordHighlightProp> = (props) => {
  const { sentence, highlightWords } = props;
  const posList = findHighlightWordPos(
    sentence,
    highlightWords,
  );
  return <PosHighlight sentence={sentence} posList={posList}/>;
};

const Highlight: React.FC<HighlightProp> = (props) => {
  const { posList, highlightWords, sentence } = props;

  if (posList && posList.length)
    return <PosHighlight sentence={sentence} posList={posList}/>;

  if (highlightWords && highlightWords.length)
    return <WordHighlight sentence={sentence} highlightWords={highlightWords}/>;

  return <Sentence>{sentence}</Sentence>;
};

export default Highlight;
