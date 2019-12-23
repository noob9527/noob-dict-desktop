import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { SearchState } from '../search/search-model';
import { ThemedCheckbox } from '../../components/checkbox/checkbox';
import { SettingState } from './setting-model';
import { ThemedContent } from '../../components/content/content';
import { ThemedInputShortcut } from '../../components/input-shortcut/themed-input-shortcut';

const Container = styled.div`
  height: 200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const InlineContainer = styled.span`
  display: inline-flex;
  align-items: center;
  > * + * {
    margin-left: 10px;
  }
`;

const SettingPage = () => {
  const dispatch = useDispatch();
  const searchState: SearchState = useSelector((state: any) => state.search);
  const settingState: SettingState = useSelector((state: any) => state.setting);
  const { pinned } = searchState;
  const { appHotKey } = settingState;

  return (
    <ThemedContent>
      <Container>
        {/*<Button*/}
        {/*  type="link"*/}
        {/*  shape="circle"*/}
        {/*  onClick={() => {*/}
        {/*    dispatch({*/}
        {/*      type: 'search/togglePinned',*/}
        {/*    });*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Icon*/}
        {/*    type="pushpin"*/}
        {/*    style={{ transform: `rotate(${pinned ? '-45deg' : '0deg'})` }}*/}
        {/*  />*/}
        {/*</Button>*/}
        <ThemedCheckbox>watch selection (only on linux)</ThemedCheckbox>
        <ThemedCheckbox>watch clipboard</ThemedCheckbox>
        <InlineContainer>
          <span>hot key:</span>
          <ThemedInputShortcut
            value={appHotKey}
            onChange={value => {
              dispatch({
                type: 'setting/mergeState',
                payload: {
                  appHotKey: value,
                },
              });
            }}
          />
        </InlineContainer>
      </Container>
    </ThemedContent>
  );
};

export default SettingPage;