import React from 'react'
import styled from 'styled-components'
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { TranslatePage } from './translate/translate-page'
import { WriteSuggestionPage } from './write-suggestion/write-suggestion-page'
import ColorId from '../../styles/ColorId'
import { Tab, TextareaActions, useCurrentLan, useTextareaStore } from './textarea-store';
import { ThemedEmpty } from '../../components/themed-ui/empty/empty';
import { ModelSelect } from './model-selector';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import changeTab = TextareaActions.changeTab;
import { useSettingStore } from '../setting/setting-store';
import { RouterMenu, RouterMenuItem } from '../../components/themed-ui/tabs/router-menu';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 11px;
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

  // const { url } = useRouteMatch();
  // const dispatch = useDispatch();
  // function goto(routeName: string) {
  //   dispatch(push(`${url}/${routeName}`));
  // }

  const availableLLMProviders = useSettingStore.use
    .availableLLMProviders()
  const raw = useTextareaStore.use.raw()
  const language = useCurrentLan()

  if (!availableLLMProviders.length) {
    return (
      <ThemedEmpty description={'No available LLM'}/>
    )
  }

  if (!raw && language == null) {
    return (
      <ThemedEmpty description={'No input text'} />
    )
  }

  let menu: JSX.Element
  if (language == 'EN') {
    // display rewrite tab only when lan is EN
    menu = (
      <RouterMenu>
        <RouterMenuItem
          active={active == 'translate'}
          onClick={() => {
            changeTab(Tab.trans)
            // goto('/main/textarea/translate')
          }}
          to={'/main/textarea/translate'}
        >Trans</RouterMenuItem>
        <RouterMenuItem
          active={active == 'write_suggestion'}
          onClick={() => {
            changeTab(Tab.rewrite)
            // goto('/main/textarea/write_suggestion')
          }}
          to={'/main/textarea/write_suggestion'}
        >Rewrite</RouterMenuItem>
      </RouterMenu>
    )
  } else {
    menu = (
      <RouterMenu>
        <RouterMenuItem
          active={active == 'translate'}
          to={'/main/textarea/translate'}>Trans</RouterMenuItem>
      </RouterMenu>
    )
  }

  return (
    <RightContainer>
      <Header>
        <Nav>
          {menu}
        </Nav>
        <ModelSelect />
      </Header>
      <Content>
        <Switch>
          <Route path={`/main/textarea/translate`} component={TranslatePage}/>
          <Route path={`/main/textarea/write_suggestion`} component={WriteSuggestionPage}/>
          <Route component={TranslatePage} />
        </Switch>
      </Content>
    </RightContainer>
  )
}
