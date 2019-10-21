import React from 'react';
import { useDispatch, useSelector } from 'dva';
import { Tabs } from "antd";
import { EngineIdentifier, SearchResult } from 'noob-dict-core';
import styles from './search-panel.module.scss';
import { SearchPanelState } from "./search-panel-model";
import EngineView from "../views/engine/EngineView";
import NoteView from '../views/note/NoteView';
import HistoryView from "../views/history/HistoryView";


export default () => {
  const dispatch = useDispatch();
  const state: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const { searchResults, currentTab, note, histories } = state;

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
          Object.entries(searchResults)
            .map(entry => getEnginePane(entry[0] as EngineIdentifier, entry[1]))
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
  let html: string;
  if (value) {
    html = value.html;
  } else {
    html = Array.from({ length: 100 }).map((e, i) => `<div>hello ${i}</div>`).join('\n');
  }

  return (
    <Tabs.TabPane
      tab={key}
      key={key}
    >
      <EngineView html={html} searchResult={value}/>
    </Tabs.TabPane>
  );
}
