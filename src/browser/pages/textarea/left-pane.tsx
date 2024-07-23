import React from 'react'
import styled from 'styled-components'
import { ThemedTextArea2 } from '../../components/themed-ui/input/textarea2'
import { FooterToolBar } from './footer-tool-bar'
import changeRawText = TextareaActions.changeRawText
import { LanguageSelect } from './language-selector';
import ColorId from '../../styles/ColorId';
import { TextareaActions, useTextareaStore } from './textarea-store';

export const LeftContainer = styled.div`
  color: ${(props) => props.theme[ColorId.input_foreground]};
  background-color: ${(props) => props.theme[ColorId.input_background]};

  flex-basis: 50%;
  flex-shrink: 0;
  margin: 10px;
  //position: relative;

  display: flex;
  flex-direction: column;
`;

const RawTextArea = styled(ThemedTextArea2)`
  //border-top: ${(props) => props.theme[ColorId.background]} 1px solid;
  font-size: 1.5rem;
  width: 100%;
  flex-grow: 1;
  //min-height: 100%;
  resize: none;
`

const Header = styled.div`
  height: 40px;
  padding: 5px 11px;
  display: flex;
  align-items: center;
`

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`

export const LeftPane: React.FC = () => {
  const raw = useTextareaStore.use.raw()

  return (
    <LeftContainer>
      <Header>
        <LanguageSelect />
      </Header>
      <RawTextArea
        value={raw}
        placeholder={'write text here'}
        readOnly={false}
        onChange={(e) => {
          changeRawText(e.target.value)
        }}
        spellCheck={false}
      />
    </LeftContainer>
  )
}
