import React from 'react';
import styled from 'styled-components';
import ColorId from '../../../../styles/ColorId';

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
  highlightWords?: Set<string>
}

interface PosHighlightProp {
  sentence: string
  posList: [number, number][]
}

interface WordHighlightProp {
  sentence: string
  highlightWords: Set<string>
}

const PosHighlight: React.FC<PosHighlightProp> = (props) => {
  const { sentence } = props;
  return <Sentence>{sentence}</Sentence>;
};

const WordHighlight: React.FC<WordHighlightProp> = (props) => {
  const { sentence, highlightWords } = props;
  const words = sentence.split(/\s+/);
  // return <Sentence>{sentence}</Sentence>;
  return <Sentence>{words.map((e, i) =>
    (highlightWords.has(e)
        ? <HighlightSpan key={i}>{e} </HighlightSpan>
        : <NormalSpan key={i}>{e} </NormalSpan>
    ))
  }
  </Sentence>;
};

const Highlight: React.FC<HighlightProp> = (props) => {
  const { posList, highlightWords, sentence } = props;

  if (posList && posList.length)
    return <PosHighlight sentence={sentence} posList={posList}/>;

  if (highlightWords && highlightWords.size)
    return <WordHighlight sentence={sentence} highlightWords={highlightWords}/>;

  return <Sentence>{sentence}</Sentence>;
};

export default Highlight;