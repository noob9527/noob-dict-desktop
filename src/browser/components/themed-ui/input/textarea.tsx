import { Input } from 'antd';
import styled from 'styled-components';
import ColorId from '../../../styles/ColorId';

const ThemedTextArea = styled(Input.TextArea)`
  &.ant-input {
    color: ${props => props.theme[ColorId.input_foreground]};
    background-color: ${props => props.theme[ColorId.input_background]};
    border: 0;
    border-radius: 0;

    &:focus {
      border: 0;
      box-shadow: none;
    }
  }
`;

export {
  ThemedTextArea,
};
