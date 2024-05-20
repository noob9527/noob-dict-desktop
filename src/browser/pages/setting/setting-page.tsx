import React from 'react'
import styled from 'styled-components'
import { ThemedContent } from '../../components/themed-ui/content/content'
import SettingPageSplitPane from './setting-page-split-pane'
import { GeneralSettingPage } from './general/general-setting-page'
import { SyncSettingPage } from './sync/sync-setting-page'
import { LLMProviderSettingPage } from './llm/providers/llm-provider-setting-page'
import {
  SideMenu,
  SideMenuItem, SideSubMenu,
} from '../../components/themed-ui/menu/side-menu';
import { Link, Route, Switch } from 'react-router-dom'
import { PromptSetting } from './llm/prompt-setting';

const Container = styled.div`
  height: 100vh;
`

// @ts-ignore
const StyledSideMenu = styled(SideMenu)`
  height: 100%;
`

const StyledContent = styled.div`
  height: 100%;
  overflow: hidden;
  //margin: 0 20px;
  margin-left: 20px;
`

const SettingPage = () => {
  return (
    <ThemedContent>
      <Container>
        <SettingPageSplitPane split="vertical" minSize={220}>
          <StyledSideMenu
            defaultSelectedKeys={['general']}
            mode={'inline'}
          >
            <SideMenuItem key="general">
              <Link to="/setting/general">General</Link>
            </SideMenuItem>
            <SideMenuItem key="auto_sync">
              <Link to="/setting/auto_sync">Auto Sync</Link>
            </SideMenuItem>
            <SideSubMenu title="LLM">
              <SideMenuItem key={'llm_providers'}>
                <Link to="/setting/llm/providers">Providers</Link>
              </SideMenuItem>
              <SideSubMenu title="Prompts">
                <SideMenuItem key={'trans_text_to_en'}>
                  <Link to="/setting/llm/prompts/trans_text_to_en">Translate to EN</Link>
                </SideMenuItem>
                <SideMenuItem key={'trans_text_en_to_cn'}>
                  <Link to="/setting/llm/prompts/trans_text_en_to_cn">Translate to CN</Link>
                </SideMenuItem>
                <SideMenuItem key={'rewrite_text_en'}>
                  <Link to="/setting/llm/prompts/rewrite_text_en">Rewrite</Link>
                </SideMenuItem>
                <SideMenuItem key={'quiz_singular_choice'}>
                  <Link to="/setting/llm/prompts/quiz_singular_choice">Quiz Generator</Link>
                </SideMenuItem>
              </SideSubMenu>
            </SideSubMenu>
          </StyledSideMenu>

          <StyledContent>
            <Switch>
              <Route path={`/setting/general`} component={GeneralSettingPage} />
              <Route path={`/setting/auto_sync`} component={SyncSettingPage} />
              <Route path={`/setting/llm/providers`} component={LLMProviderSettingPage} />
              <Route path={`/setting/llm/prompts/:workflow`} component={PromptSetting} />
              <Route component={GeneralSettingPage} />
            </Switch>
          </StyledContent>
        </SettingPageSplitPane>
      </Container>
    </ThemedContent>
  )
}

export default SettingPage
