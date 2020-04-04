import styled from 'styled-components';
import { ThemedButton } from './button';
import Color from 'color';

const GithubButton = styled(ThemedButton)`
  &.ant-btn {
    background-color: #333333;
    :hover,:active,:focus {
      background-color: ${Color('#333333').darken(0.2).toString()};
    }
  }
`;

const WeiboButton = styled(ThemedButton)`
  &.ant-btn {
    background-color: #f3721e;
    :hover,:active,:focus {
      background-color: ${Color('#f3721e').darken(0.2).toString()};
    }
  }
`;

export {
  GithubButton,
  WeiboButton,
};
