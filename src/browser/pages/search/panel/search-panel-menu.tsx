import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
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
    //border-bottom: none;
    //position: relative;
    //list-style: none;
    //cursor: pointer;

    color:${props => props.theme[ColorId.tab_inactiveForeground]};
    background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
    &.active {
      color:${props => props.theme[ColorId.tab_activeForeground]};
      background-color: ${props => props.theme[ColorId.tab_activeBackground]};
    }

    a {
      display: inline-block;
      text-align: center;
      padding: 6px 12px;
      width: 8em;
      text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle;
      
      color: unset;
      transition: none;
    }
    a:hover {
      color: unset;
    }
`;

export {
  Menu,
  MenuItem
};

