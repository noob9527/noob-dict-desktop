import React, { useEffect } from 'react';
import { useSelector } from 'dva';
import { SearchResults } from "./search-domain";
import { Icon, Tabs } from "antd";
import { SearchResult, EngineIdentifier } from 'noob-dict-core';
import styles from './search.module.scss';

// let executed = false;

export default () => {

  const results: SearchResults = useSelector((state: any) => state.search.searchResults);

  // const result = results && results[EngineIdentifier.BING];


  return (
    <div className={styles.searchPanel}>
      <Tabs
        tabBarGutter={0}
        tabBarStyle={{
          margin: 0
        }}>
        {
          Object.entries(results)
            .map(entry => getPane(entry[0] as EngineIdentifier, entry[1]))
        }
      </Tabs>
    </div>
  );
}

function getPane(key: EngineIdentifier, value: Maybe<SearchResult>) {
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
      <iframe width="100%" height="100%" frameBorder={0} srcDoc={html}/>
    </Tabs.TabPane>
  );
}
