import React from 'react';
import styles from './search-tool-bar.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, Icon, Menu } from "antd";
import { SearchPanelState } from "../panel/search-panel-model";
import { ThemeType } from "antd/es/icon";
import { ClickParam } from "antd/es/menu";
import { CollectionAction } from "../../../db/note";
import styled from 'styled-components';

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
  const panelState: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const { note, primaryResult } = panelState;


  return (
    <ToolBar>
      <Button
        type="link"
        shape="circle"
        onClick={() => {
          console.log('hello');
          dispatch({
            type: 'setting/open',
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
        ghost
      >
        <Icon
          type="pushpin"
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
