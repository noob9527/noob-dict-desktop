import styled from 'styled-components';
import { ThemedButton } from './button';
import Color from 'color';

// "as any" to suppress
// Type of property 'propTypes' circularly references itself in mapped type 'ForwardRefExoticBase<Omit<Omit<any, any> & Partial<Pick<any, any>>, "theme"> & { theme?: any; } & WithChildrenIfReactComponentClass<StyledComponentInnerComponent<WithC>>>'
const GithubButton = styled(ThemedButton as any)`
  &.ant-btn {
    background-color: #333333;
    :hover,:active,:focus {
      background-color: ${Color('#333333').darken(0.2).toString()};
    }
  }
`;

// "as any" to suppress
// Type of property 'propTypes' circularly references itself in mapped type 'ForwardRefExoticBase<Omit<Omit<any, any> & Partial<Pick<any, any>>, "theme"> & { theme?: any; } & WithChildrenIfReactComponentClass<StyledComponentInnerComponent<WithC>>>'
const WeiboButton = styled(ThemedButton as any)`
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
