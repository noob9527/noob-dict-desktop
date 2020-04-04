import React from 'react';
import styled from 'styled-components';
import { ThemedContent } from '../../components/themed-ui/content/content';
import { ThemedButton } from '../../components/themed-ui/button/button';
import { githubOption, weiboOption } from '../../../common/social-login';
import { Icon } from 'antd';
import { GithubButton, WeiboButton } from '../../components/themed-ui/button/social-button';

const Container = styled.div`
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const LoginPage = () => {
  return (
    <ThemedContent>
      <Container>
        <GithubButton
          icon="github"
          onClick={() => {
            window.location.href = githubOption.url;
          }}
        >Login with GitHub</GithubButton>
        <WeiboButton
          icon="weibo"
          onClick={() => {
            window.location.href = weiboOption.url;
          }}
        >Login with Weibo</WeiboButton>
      </Container>
    </ThemedContent>
  )
};

export default LoginPage;