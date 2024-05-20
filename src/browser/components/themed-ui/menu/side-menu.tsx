import { Menu } from 'antd';
import styled from 'styled-components';
import ColorId from '../../../styles/ColorId';


const SideMenu = styled(Menu)`
  background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
  color: ${props => props.theme[ColorId.tab_inactiveForeground]};
  &.ant-menu-vertical, &.ant-menu-inline {
    border: none;
  }
`

const SideMenuItem = styled(SideMenu.Item)`
  background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};

  &:active {
    background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
  }

  > a {
    color: ${props => props.theme[ColorId.tab_inactiveForeground]};

    &:hover {
      color: ${props => props.theme[ColorId.tab_activeForeground]}
    }
  }

  &.ant-menu-item-selected {
    > a, > a:hover {
      color: ${props => props.theme[ColorId.tab_activeForeground]};
    }

    &:after {
      border-right: 3px solid ${props => props.theme[ColorId.tab_activeForeground]};
      //border-right: none;
    }
  }

  .ant-menu:not(.ant-menu-horizontal) &.ant-menu-item-selected {
    background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
  }
`

const SideSubMenu = styled(SideMenu.SubMenu)`
  > .ant-menu {
    background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
  }
  .ant-menu-submenu-title {
    color: ${props => props.theme[ColorId.tab_inactiveForeground]};
    &:active {
      background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
    }
  }
  .ant-menu-submenu-title:hover {
    color: ${props => props.theme[ColorId.tab_activeForeground]};
  }
  &.ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow {
    &::before {
      background: ${props => props.theme[ColorId.tab_activeForeground]};
    }
    &::after {
      background: ${props => props.theme[ColorId.tab_activeForeground]};
    }
  }
  

  &.ant-menu-submenu-selected {
    color: ${props => props.theme[ColorId.tab_activeForeground]};
  }
`

export {
  SideMenu,
  SideSubMenu,
  SideMenuItem,
}
