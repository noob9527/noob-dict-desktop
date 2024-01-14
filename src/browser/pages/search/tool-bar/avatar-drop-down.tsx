import React from 'react'
import { Avatar, Dropdown, Icon, Menu, Spin } from 'antd'
import styled from 'styled-components'
import { ThemedTooltip } from '../../../components/themed-ui/tooltip/tooltip'
import ColorId from '../../../styles/ColorId'
import { RootActions, useRootStore } from '../../../root-store'

const Container = styled.div`
  cursor: pointer;
`

const SpinContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
`

const StyledSpin = styled(Spin)`
  &.ant-spin-spinning {
    margin: auto;
    display: inline-flex;

    &.ant-spin-dot-spin {
      margin: auto;
    }
  }
`

const ThemedMenu = styled(Menu)`
  &.ant-dropdown-menu {
    background-color: ${(props) => props.theme[ColorId.dropdown_background]};

    .ant-dropdown-menu-item {
      color: ${(props) => props.theme[ColorId.dropdown_foreground]};

      :hover,
      :active,
      :focus {
        background-color: ${(props) =>
          props.theme[ColorId.dropdown_background]};
      }
    }
  }
`

const AvatarDropDown: React.FC = () => {
  const currentUser = useRootStore.use.currentUser()
  const showLoginIndicator = useRootStore.use.showLoginIndicator()

  if (!currentUser) {
    if (showLoginIndicator) {
      return (
        <SpinContainer>
          <StyledSpin />
        </SpinContainer>
      )
    } else {
      return (
        <Container
          onClick={() => {
            RootActions.login()
          }}
        >
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <ThemedTooltip title={'login'}>
            <Avatar icon={<Icon type={'user'} />} />
          </ThemedTooltip>
        </Container>
      )
    }
  } else {
    return (
      <Container>
        <Dropdown
          overlay={getDropdownMenu}
          // visible={true}
        >
          {currentUser?.picture ? (
            <Avatar src={currentUser?.picture} />
          ) : (
            <Avatar icon={<Icon type={'user'} />} />
          )}
        </Dropdown>
      </Container>
    )
  }

  function getDropdownMenu() {
    return (
      <ThemedMenu
        onClick={(e) => {
          const { key } = e
          // noinspection JSRedundantSwitchStatement
          switch (key) {
            case 'logout':
              RootActions.logout()
              break
          }
        }}
      >
        <Menu.Item key="logout">退出登录</Menu.Item>
      </ThemedMenu>
    )
  }
}

export { AvatarDropDown }
