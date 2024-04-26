import styled from 'styled-components';
import ColorId from '../../styles/ColorId';

export const LeftContainer = styled.div`
  color: ${(props) => props.theme[ColorId.input_foreground]};
  background-color: ${(props) => props.theme[ColorId.input_background]};

  flex-basis: 50%;
  margin: 10px;
  //position: relative;

  display: flex;
  flex-direction: column;
`;
