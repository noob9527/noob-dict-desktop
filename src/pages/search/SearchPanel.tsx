import React from 'react';
import { useSelector } from 'dva';
import { SearchResults } from "./search-demain";
import { Icon, Tabs } from "antd";
import { SearchResult, EngineIdentifier } from 'noob-dict-core';

export default () => {

  const results: SearchResults = useSelector((state: any) => state.search.searchResults);

  return (
    <>
      <Tabs type="card">
        {
          Object.entries(results)
            .map(entry => fn(entry[0] as EngineIdentifier, entry[1]))
        }
        {
          Object.values(results)
            .filter(e => !!e)
            .map((result: Maybe<SearchResult>) => {
              if (!result) return (<div>no result</div>);
            })
        }
      </Tabs>
    </>
  );
}

function fn(key: EngineIdentifier, value: Maybe<SearchResult>) {
  return (
    <Tabs.TabPane
      tab={<Icon type="apple"/>}
      key={key}
    >
      {
        value
          ? (<div dangerouslySetInnerHTML={{ __html: value.processedHtml }}/>)
          : (<div>hello {key}</div>)
      }
    </Tabs.TabPane>
  )
}
