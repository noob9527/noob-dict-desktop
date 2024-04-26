import styled from 'styled-components';
import ColorId from '../../styles/ColorId';

export const RightContainer = styled.div`
  flex-basis: 50%;
  flex-grow: 0;
  margin: 10px;
  font-size: 1.5rem;

  color: ${(props) => props.theme[ColorId.input_foreground]};
  background-color: ${(props) => props.theme[ColorId.input_disableBackground]};
  display: flex;
  flex-direction: column;
`;
