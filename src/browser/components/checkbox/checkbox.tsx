import { Checkbox } from 'antd';
import styled from 'styled-components';
import ColorId from '../../styles/ColorId';

const ThemedCheckbox = styled(Checkbox)`
  &.ant-checkbox-wrapper {
    color: ${props => props.theme[ColorId.foreground]};
  }
  &.ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: unset;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    border-color: rebeccapurple;
    background-color: rebeccapurple;
  }
`;

export {
  ThemedCheckbox,
};
