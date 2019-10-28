import styled from 'styled-components';
import ColorId from '../../../styles/ColorId';

const ThemedContent = styled.div`
  color: ${props => props.theme[ColorId.foreground]};
  background-color: ${props => props.theme[ColorId.background]};
  h1,h2,h3,h4,h5,h6 {
    color: ${props => props.theme[ColorId.foreground]}
  }
`;

export { ThemedContent };
