import React from 'react';
import { Link, useRouteMatch, NavLink } from "react-router-dom";
import styled from 'styled-components';
import ColorId from '../../../styles/ColorId';

const Menu = styled.ul`
  background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
  color: ${props => props.theme[ColorId.tab_inactiveForeground]};
  margin: 0;
  padding: 0;
`;

const MenuItemElement: React.FC<any> = (props) => {
  let { to, className, children } = props;
  const match = useRouteMatch({
    path: to,
    exact: true
  });
  className += match ? ' active' : '';
  return (
    <li className={className}><Link to={to}>{children}</Link></li>
  );
};

const MenuItem = styled(MenuItemElement)`
    display: inline-block;
    border-bottom: none;
    position: relative;
    list-style: none;
    cursor: pointer;
    padding: 6px 12px;

    color:${props => props.theme[ColorId.tab_inactiveForeground]};
    background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
    &.active {
      color:${props => props.theme[ColorId.tab_activeForeground]};
      background-color: ${props => props.theme[ColorId.tab_activeBackground]};
    }
    a {
      color: unset;
      transition: none;
    }
    a:hover {
      color: unset;
    }
`;

const SearchPanelHeader: React.FC = () => {
  return (
    <nav>
      <Menu>
        <MenuItem to={"/search/tab1"}>tab1</MenuItem>
        <MenuItem to={"/search/tab2"}>tab2</MenuItem>
        <MenuItem to={"/search/tab3"}>tab3</MenuItem>
      </Menu>
    </nav>
  );
};

export default SearchPanelHeader;

