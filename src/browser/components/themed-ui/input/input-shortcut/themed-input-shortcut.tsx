import styled from 'styled-components';
import { InputShortcut } from './input-shortcut';
import ColorId from '../../../../styles/ColorId';

const ThemedInputShortcut = styled(InputShortcut)`
  min-width: 100px;
  background-color: ${props => props.theme[ColorId.button_background]};
  height: 23px;
  //align-self: stretch;
  border: 0;
`;

export { ThemedInputShortcut };
