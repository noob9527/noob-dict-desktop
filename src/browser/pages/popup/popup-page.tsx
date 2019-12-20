import React from 'react';
import styled from 'styled-components';
import ColorId from '../../styles/ColorId';
import { useDispatch, useSelector } from 'react-redux';
import { SearchState } from '../search/search-model';
import { Button, Icon } from 'antd';

const Popup = styled.div`
  // https://electronjs.org/docs/api/frameless-window
  -webkit-app-region: drag;
  -webkit-user-select: none;

  width: 50px;
  height: 50px;
  background-color: black;
  color: white;
`;

const PopupPage = () => {
  const dispatch = useDispatch();
  const searchState: SearchState = useSelector((state: any) => state.search);
  const { pinned } = searchState;
  return (
    <Popup>
      <Button
        type="link"
        shape="circle"
        onClick={() => {
          console.log(111);
          // dispatch({
          //   type: 'search/togglePinned',
          // });
        }}
      >
        <Icon
          type="pushpin"
          style={{ transform: `rotate(${pinned ? '-45deg' : '0deg'})` }}
        />
      </Button>
    </Popup>
  );
};

export default PopupPage;
