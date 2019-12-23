import styled from 'styled-components';
import ColorId from '../../styles/ColorId';

const ThemedContent = styled.div`
  color: ${props => props.theme[ColorId.foreground]};
  background-color: ${props => props.theme[ColorId.background]};
`;

export { ThemedContent };
