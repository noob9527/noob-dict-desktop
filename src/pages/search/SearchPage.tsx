import React from 'react';
import { Layout } from "antd";
import SearchPanel from "./SearchPanel";
import SearchHeader from "./SearchHeader";
import styles from './search.module.scss';

export default () => {
  return (
    <Layout className={styles.searchPage}>
      <Layout.Header>
        <SearchHeader/>
      </Layout.Header>
      <Layout.Content>
        <SearchPanel/>
      </Layout.Content>
    </Layout>
  );
}