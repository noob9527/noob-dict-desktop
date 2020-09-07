import styled from 'styled-components';
import ColorId from '../../styles/ColorId';
import React from 'react';

const MainMenu = styled.ul`
  height: 100%;
  background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
  color: ${props => props.theme[ColorId.tab_inactiveForeground]};
  margin: 0;
  padding: 0;
`;

interface MenuItemProps {
  className?: string
  active?: boolean
  onClick?: () => void
}

const defaultMenuItemProps: MenuItemProps = {
  active: true,
  onClick: () => {
  },
};

const MenuItem: React.FC<MenuItemProps> = (props) => {
  let { className, children, active, onClick } = props;
  className += active ? ' active' : '';
  return (
    <li className={className} onClick={onClick}>{children}</li>
  );
};

MenuItem.defaultProps = defaultMenuItemProps;

const MainMenuItem = styled(MenuItem)`
  padding: 10px;
  cursor: pointer;
  color:${props => props.theme[ColorId.tab_inactiveForeground]};
  background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
  border-left: 2px solid ${props => props.theme[ColorId.tab_inactiveBackground]};
  &.active {
    color:${props => props.theme[ColorId.tab_activeForeground]};
    border-left: 2px solid ${props => props.theme[ColorId.tab_activeForeground]};
  }
  &:hover {
    color:${props => props.theme[ColorId.tab_activeForeground]};
  }
`;

export {
  MainMenu,
  MainMenuItem,
};

