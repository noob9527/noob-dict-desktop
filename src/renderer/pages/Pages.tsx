import React from 'react';
import { Layout, Menu, Icon } from "antd";
import { Link } from 'react-router-dom';


const Page: React.FC<any> = props => {
  const { children } = props;
  return (
    <Layout>
      <Layout.Sider>
        <Menu mode="vertical" style={{
          minHeight: '100vh',
        }}>
          <Menu.Item key={1}>
            <Icon type="apple"/>
            <Link to="/test1"/>
          </Menu.Item>
          <Menu.Item key={2}>
            <Icon type="android"/>
            <Link to="/test2"/>
          </Menu.Item>
          <Menu.Item key={3}>
            <Icon type="github"/>
            <Link to="/"/>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout.Content>
        {children}
      </Layout.Content>
    </Layout>
  );
};

export default Page;
