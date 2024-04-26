import styled from 'styled-components';
import ColorId from '../../../styles/ColorId';

/**
 * without antd dep
 */
const ThemedTextArea2 = styled.textarea`
  color: ${props => props.theme[ColorId.input_foreground]};
  background-color: ${props => props.theme[ColorId.input_background]};
  border: 0;
  border-radius: 0;
  padding: 4px 11px;

  &:focus, &:focus-visible {
    border: 0;
    box-shadow: none;
    outline: none;
  }

  &::-webkit-scrollbar {
    position: absolute;
    width: 6px;
  }

  &::-webkit-scrollbar-track {
  }

  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: none;
    transition: all .4s;

    &:hover{
      background: grey;
      opacity: .6 !important;
    }

    &.active{
      background: gray;
      opacity: .6 !important;
    }
  }
  &::-webkit-scrollbar-corner {
  }
  &::-webkit-resizer {
    //display: none;
  }
`;

export {
  ThemedTextArea2,
};
