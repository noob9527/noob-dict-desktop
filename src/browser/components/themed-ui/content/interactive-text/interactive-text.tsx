import styled from 'styled-components';
import ColorId from '../../../../styles/ColorId';

export const InteractiveText = styled.span`
  color: ${props => props.theme[ColorId.word_link]};
  cursor: pointer;
`;
