import styled from 'styled-components';
import ColorId from '../../../styles/ColorId';
import { Button } from 'antd';

const ThemedButton = styled(Button)`
  &.ant-btn {
    border-radius: 0;
    border: 0;
    color: ${props => props.theme[ColorId.button_foreground]};
    background-color: ${props => props.theme[ColorId.button_background]};
    :hover,:active,:focus {
      //color: unset;
      color: ${props => props.theme[ColorId.button_foreground]};
      background-color: ${props => props.theme[ColorId.button_hoverBackground]};
    }
    &[disabled] {
      background-color: ${props => props.theme[ColorId.button_disabledBackground]};
    }
  }
`;

export { ThemedButton };
