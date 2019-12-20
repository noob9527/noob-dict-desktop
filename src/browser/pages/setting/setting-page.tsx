import React from 'react';
import styled from 'styled-components';
import ColorId from '../../styles/ColorId';
import { useDispatch, useSelector } from 'react-redux';
import { SearchState } from '../search/search-model';
import { Button, Icon } from 'antd';


const SettingPage = () => {
  const dispatch = useDispatch();
  const searchState: SearchState = useSelector((state: any) => state.search);
  const {pinned} = searchState;
  return (
    <div>
      setting
      <Button
        type="link"
        shape="circle"
        onClick={() => {
          dispatch({
            type: 'search/togglePinned',
          });
        }}
      >
        <Icon
          type="pushpin"
          style={{ transform: `rotate(${pinned ? '-45deg' : '0deg'})` }}
        />
      </Button>
    </div>
  );
};

export default SettingPage;