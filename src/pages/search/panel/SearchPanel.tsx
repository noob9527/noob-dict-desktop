import React from 'react';
import { useDispatch, useSelector } from 'dva';
import { Tabs } from "antd";
import { EngineIdentifier, SearchResult } from 'noob-dict-core';
import styles from './search-panel.module.scss';
import { SearchPanelState } from "./search-panel-model";
import EngineView from "../views/engine/EngineView";
import NoteView from '../views/note/NoteView';
import HistoryView from "../views/history/HistoryView";
import OverviewView from "../views/overview/OverviewView";


export default () => {
  const dispatch = useDispatch();
  const state: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const { primaryResult, searchResults, currentTab, note, histories } = state;

  return (
    <div className={styles.searchPanel}>
      <Tabs
        activeKey={currentTab}
        onChange={(tab) => {
          dispatch({
            type: 'searchPanel/mergeState',
            payload: {
              currentTab: tab
            }
          });
        }}
        tabBarGutter={0}
        tabBarStyle={{
          margin: 0
        }}>
        {
          primaryResult ? null :
            <Tabs.TabPane
              tab="OVERVIEW"
              key="OVERVIEW"
            >
              <OverviewView/>
            </Tabs.TabPane>
        }
        {
          Object.values(searchResults)
            .filter(e => !!e)
            .map((result: Maybe<SearchResult>) =>
              <Tabs.TabPane
                tab={result!.engine}
                key={result!.engine}
              >
                <EngineView html={result!.html} searchResult={result}/>
              </Tabs.TabPane>
            )
        }
        {note ?
          <Tabs.TabPane
            tab="NOTE"
            key="NOTE"
          >
            <NoteView note={note}/>
          </Tabs.TabPane>
          : null
        }
        {histories.length ?
          <Tabs.TabPane
            tab="HISTORY"
            key="HISTORY"
          >
            <HistoryView histories={histories}/>
          </Tabs.TabPane>
          : null
        }
      </Tabs>
    </div>
  );
}

function getEnginePane(key: EngineIdentifier, value: Maybe<SearchResult>) {
  if (!value) return null;

  return (
    <Tabs.TabPane
      tab={key}
      key={key}
    >
      <EngineView html={value.html} searchResult={value}/>
    </Tabs.TabPane>
  );
}
