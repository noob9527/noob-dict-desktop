import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'antd';
import { SearchPanelState } from '../panel/search-panel-model';
import styled from 'styled-components';
import { SearchState } from '../search-model';
import { rendererContainer } from '../../../../common/container/renderer-container';
import { PopupUiService, PopupUiServiceToken } from '../../../../common/services/popup-ui-service';

const ToolBar = styled.div`
  display: flex;
  align-items: center;
  //i {
  //  margin: 5px;
  //}
  i.anticon-pushpin {
    font-size: 1.1em; 
  }
`;


export default () => {
  const dispatch = useDispatch();
  const searchState: SearchState = useSelector((state: any) => state.search);
  const panelState: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const { note, primaryResult } = panelState;
  const { pinned } = searchState;

  const popupUiService = rendererContainer.get<PopupUiService>(PopupUiServiceToken);

  return (
    <ToolBar>
      <Button
        type="link"
        shape="circle"
        onClick={() => {
          popupUiService.show();
          // dispatch({
          //   type: 'popup/show',
          // });
        }}
        ghost
      >
        <Icon
          type="smile"
        />
      </Button>
      <Button
        type="link"
        shape="circle"
        onClick={() => {
          dispatch({
            type: '_transient/openSettingWindow',
          });
        }}
        ghost
      >
        <Icon
          type="setting"
        />
      </Button>
      <Button
        type="link"
        shape="circle"
        onClick={() => {
          dispatch({
            type: 'search/togglePinned',
          });
        }}
        ghost
      >
        <Icon
          type="pushpin"
          style={{ transform: `rotate(${pinned ? '-45deg' : '0deg'})` }}
        />
      </Button>
    </ToolBar>
  );

  // <div className={styles.toolbar}>
  //   <Dropdown
  //     disabled={!note && primaryResult == null}
  //     overlay={
  //       // note ? <></> : getMenu
  //       <></>
  //     }>
  //     <Button
  //       type="link"
  //       shape="circle"
  //       ghost
  //       onClick={handleButtonClick}
  //     >
  //       <Icon
  //         type="heart"
  //         // style={{ color: heartColor }}
  //         theme={theme}
  //       />
  //     </Button>
  //   </Dropdown>
  // </div>

  // function getMenu() {
  //   if (note) return <></>;
  //   else
  //     return (
  //       <Menu onClick={handleMenuClick}>
  //         <Menu.Item key="1">
  //           <Icon type="heart" theme="filled" style={{ color: heartColor }}/>
  //           收藏
  //         </Menu.Item>
  //         <Menu.Item key="2">
  //           <Icon type="heart" theme="twoTone" twoToneColor={heartColor}/>
  //           快速收藏
  //         </Menu.Item>
  //       </Menu>
  //     );
  // }
  //
  // function handleButtonClick() {
  //   dispatch({
  //     type: 'searchToolBar/toggleCollect',
  //     payload: {
  //       note,
  //     },
  //   });
  // }
  //
  // function handleMenuClick(param: ClickParam) {
  //   // dispatch({
  //   //
  //   // });
  //   console.log(param);
  // }

}
