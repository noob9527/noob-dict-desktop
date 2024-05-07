import React from 'react'
import styled from 'styled-components'
import { RightPaneMenu, RightPaneMenuItem } from './right-pane-menu'
import { Route, Switch, useLocation } from 'react-router-dom'
import { TranslatePage } from './translate/translate-page'
import { WriteSuggestionPage } from './write-suggestion/write-suggestion-page'
import ColorId from '../../styles/ColorId'
import { useCurrentLan, useTextareaStore } from './textarea-store';
import { ThemedEmpty } from '../../components/themed-ui/empty/empty';

const Header = styled.div`
`

const Nav = styled.nav`
  ul {
    li {
      a {
        height: 40px;
        line-height: 28px;
      }
    }
  }
`

const RightContainer = styled.div`
  color: ${(props) => props.theme[ColorId.input_foreground]};
  background-color: ${(props) => props.theme[ColorId.input_disableBackground]};

  flex-basis: 50%;
  flex-grow: 0;
  margin: 10px;

  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  overflow: hidden;
  height: 100%;
  flex-grow: 1;
`

export const RightPane: React.FC = () => {
  const location = useLocation();
  const matched = /textarea\/(\w+)/
    .exec(location.pathname)
  const active = (matched && matched[1]) ?? 'translate'

  const raw = useTextareaStore.use.raw()
  const language = useCurrentLan()
  if (!raw && language == null) {
    return (
      <ThemedEmpty />
    )
  }

  let menu: JSX.Element
  if (language == 'EN') {
    // display rewrite tab only when lan is EN
    menu = (
      <RightPaneMenu>
        <RightPaneMenuItem
          active={active == 'translate'}
          to={'/main/textarea/translate'}>Trans</RightPaneMenuItem>
        <RightPaneMenuItem
          active={active == 'write_suggestion'}
          to={'/main/textarea/write_suggestion'}>Rewrite</RightPaneMenuItem>
      </RightPaneMenu>
    )
  } else {
    menu = (
      <RightPaneMenu>
        <RightPaneMenuItem
          active={active == 'translate'}
          to={'/main/textarea/translate'}>Trans</RightPaneMenuItem>
      </RightPaneMenu>
    )
  }

  return (
    <RightContainer>
      <Header>
        <Nav>
          {menu}
        </Nav>
      </Header>
      <Content>
        <Switch>
          <Route path={`/main/textarea/translate`} component={TranslatePage}/>
          <Route path={`/main/textarea/write_suggestions`} component={WriteSuggestionPage}/>
          <Route component={TranslatePage} />
        </Switch>
      </Content>
    </RightContainer>
  )
}
