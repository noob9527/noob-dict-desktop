import styled from 'styled-components'
import ColorId from '../../../styles/ColorId'
import React from 'react'
import { Link } from 'react-router-dom'

export const RouterMenu = styled.ul`
  background-color: ${(props) => props.theme[ColorId.tab_inactiveBackground]};
  color: ${(props) => props.theme[ColorId.tab_inactiveForeground]};
  margin: 0;
  padding: 0;
`

const MenuItemContainer = styled.li`
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
`

export const RouterMenuItem: React.FC<any> = (props) => {
  let { active, onClick, to, className, children } = props
  className += active ? ' active' : ''
  return (
    <MenuItemContainer className={className} onClick={onClick}>
      <Link tabIndex={-1} to={to}>
        {children}
      </Link>
    </MenuItemContainer>
  )
}
