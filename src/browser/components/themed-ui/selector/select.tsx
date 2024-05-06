import { Select } from 'antd'
import styled, { createGlobalStyle } from 'styled-components';
import ColorId from '../../../styles/ColorId';

export const GlobalSelectStyles = createGlobalStyle`
  .ant-select-dropdown {
    border-radius: 0;
    color: ${props => props.theme[ColorId.input_foreground]};
    background-color: ${props => props.theme[ColorId.input_background]};
  }

  .ant-select-dropdown-menu-item {
    border-radius: 0;
    background-color: #3C3C3C;
    color: #F0F0F0;

    &:hover:not(&-disabled) {
      background-color: rebeccapurple;
    }
    &-selected {
      background-color: rebeccapurple;
    }
    &-active {
      background-color: rebeccapurple;
      &:not(&-disabled) {
        background-color: rebeccapurple;
      }
    }
  }
`;

export const ThemedSelect = styled(Select)`
  
  .ant-select-selection {
    color: ${props => props.theme[ColorId.input_foreground]};
    background-color: ${props => props.theme[ColorId.input_background]};

    border-radius: 0;
    border-color: unset;
    &:hover {
      border-color: unset;
    }

    .ant-select-arrow {
      color: ${props => props.theme[ColorId.input_foreground]};
    }
  }

`

