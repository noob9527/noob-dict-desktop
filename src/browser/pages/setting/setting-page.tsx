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
  margin: 20px;
`

const SettingPage = () => {
  return (
    <ThemedContent>
      <Container>
        <StyledTabs>
          <SettingPageSplitPane
            split="vertical"
            minSize={120}
          >
            <StyledTabList>
              <Tab>General</Tab>
              <Tab>Auto Sync</Tab>
            </StyledTabList>

            <StyledContent>
              <TabPanel>
                <GeneralSettingPage />
              </TabPanel>
              <TabPanel>
                <SyncSettingPage />
              </TabPanel>
            </StyledContent>
          </SettingPageSplitPane>
        </StyledTabs>
      </Container>
    </ThemedContent>
  )
}

export default SettingPage
