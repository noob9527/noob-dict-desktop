import React from 'react';
import { Layout } from "antd";
import SearchPanel from "./panel/SearchPanel";
import SearchHeaderInput from "./input/SearchInput";
import SearchToolBar from "./tool-bar/SearchToolBar";
import styles from './search.module.scss';

export default () => {
  return (
    <Layout className={styles.searchPage}>
      <Layout.Header>
        <div className={styles.searchHeader}>
          <SearchHeaderInput/>
          <SearchToolBar/>
        </div>
      </Layout.Header>
      <Layout.Content>
        <SearchPanel/>
      </Layout.Content>
    </Layout>
  );
}