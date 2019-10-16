import React from 'react';
import { Layout } from "antd";
import SearchPanel from "./SearchPanel";
import SearchHeader from "./SearchHeader";
import styles from './search.module.scss';

export default () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Header className={styles.searchHeader}>
        <SearchHeader/>
      </Layout.Header>
      <Layout.Content>
        <SearchPanel/>
      </Layout.Content>
    </Layout>
  );
}