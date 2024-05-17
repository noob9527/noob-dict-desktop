import React from 'react'
import styled from 'styled-components'
import { ThemedContent } from '../../components/themed-ui/content/content'
import SettingPageSplitPane from './setting-page-split-pane'
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
} from '../../components/themed-ui/tabs/tabs'
import ColorId from '../../styles/ColorId'
import { GeneralSettingPage } from './general/general-setting-page'
import { SyncSettingPage } from './sync/sync-setting-page';
import { LLMSettingPage } from './llm/llm-setting-page';
import { PromptSettingPage } from './llm/prompts/prompt-setting-page';

const Container = styled.div`
  height: 100vh;
  padding: 20px;
`

const StyledTabs = styled(Tabs)`
  display: flex;
  flex-direction: row;
  height: 100%;
`

// @ts-ignore
const StyledTabList = styled(TabList)`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme[ColorId.background]};
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
        <StyledTabs>
          <SettingPageSplitPane
            split="vertical"
            minSize={190}
          >
            <StyledTabList>
              <Tab>General</Tab>
              <Tab>Auto Sync</Tab>
              <Tab>LLM Providers</Tab>
            </StyledTabList>

            <StyledContent>
              <TabPanel>
                <GeneralSettingPage />
              </TabPanel>
              <TabPanel>
                <SyncSettingPage />
              </TabPanel>
              <TabPanel style={{height: '100%', overflow: 'hidden'}}>
                <LLMSettingPage />
              </TabPanel>
            </StyledContent>
          </SettingPageSplitPane>
        </StyledTabs>
      </Container>
    </ThemedContent>
  )
}

export default SettingPage
