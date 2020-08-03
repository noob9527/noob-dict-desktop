import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../root-model';
import { Avatar, Dropdown, Icon, Menu, Spin } from 'antd';
import styled from 'styled-components';
import { ThemedTooltip } from '../../../components/themed-ui/tooltip/tooltip';
import ColorId from '../../../styles/ColorId';


const Container = styled.div`
  cursor: pointer;
`;

const SpinContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
`;

const StyledSpin = styled(Spin)`
  &.ant-spin-spinning {
    margin: auto;
    display: inline-flex;
    &.ant-spin-dot-spin {
      margin: auto;
    }
  }
`;

const ThemedMenu = styled(Menu)`
  &.ant-dropdown-menu {
    background-color: ${props => props.theme[ColorId.dropdown_background]};
    .ant-dropdown-menu-item {
      color: ${props => props.theme[ColorId.dropdown_foreground]};
      :hover,:active,:focus {
        background-color: ${props => props.theme[ColorId.dropdown_background]};
      }
    }
  }
`;

const AvatarDropDown: React.FC = () => {
  const dispatch = useDispatch();
  const rootState: RootState = useSelector((state: any) => state.root);

  if (!rootState.currentUser) {
    if (rootState.showLoginIndicator) {
      return (
        <SpinContainer>
          <StyledSpin/>
        </SpinContainer>
      );
    } else {
      return (
        <Container
          onClick={() => {
            dispatch({ type: 'root/login' });
          }}>
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <ThemedTooltip title={'login'}>
            <Avatar
              icon={<Icon type={'user'}/>}
            />
          </ThemedTooltip>
        </Container>
      );
    }
  } else {
    return (
      <Container>
        <Dropdown
          overlay={getDropdownMenu}
          // visible={true}
        >
          {
            rootState.currentUser?.picture
              ? <Avatar src={rootState.currentUser?.picture}/>
              : <Avatar icon={<Icon type={'user'}/>}/>
          }
        </Dropdown>
      </Container>
    );
  }

  function getDropdownMenu() {
    return (
      <ThemedMenu onClick={e => {
        const { key } = e;
        // noinspection JSRedundantSwitchStatement
        switch (key) {
          case 'logout':
            dispatch({
              type: 'root/logout',
            });
            break;
        }
      }}>
        <Menu.Item key="logout">
          退出登录
        </Menu.Item>
      </ThemedMenu>
    );
  }
};

export { AvatarDropDown };
