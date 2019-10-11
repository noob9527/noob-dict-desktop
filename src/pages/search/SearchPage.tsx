import React from 'react';
import { Layout } from "antd";
import SearchPanel from "./SearchPanel";
import SearchHeader from "./SearchHeader";

export default () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Header>
        <SearchHeader/>
      </Layout.Header>
      <Layout.Content>
        <SearchPanel/>
      </Layout.Content>
    </Layout>
  );
}