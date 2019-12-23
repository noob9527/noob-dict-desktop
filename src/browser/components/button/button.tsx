import styled from 'styled-components';
import ColorId from '../../styles/ColorId';
import { Button } from 'antd';

const ThemedButton = styled(Button)`
  border: 0;
  background-color: ${props => props.theme[ColorId.button_background]};
`;

export { ThemedButton };
