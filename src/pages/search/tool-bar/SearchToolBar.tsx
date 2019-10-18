import React from 'react';
import styles from './search-tool-bar.module.scss';
import { useDispatch, useSelector } from 'dva';
import { Button, Dropdown, Icon, Menu } from "antd";
import { SearchToolBarState } from "./search-tool-bar-model";
import { SearchPanelState } from "../panel/search-panel-model";
import { CollectionAction } from "../../../shared/db/note";
import { ThemeType } from "antd/es/icon";
import { ClickParam } from "antd/es/menu";

const heartColor = '#eb2f96';

export default () => {
  const dispatch = useDispatch();
  const state: SearchToolBarState = useSelector((state: any) => state.searchToolBar);
  const panelState: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const { note, primaryResult } = panelState;

  let theme: ThemeType;
  if (!note)
    theme = 'outlined';
  else {
    if (note.collectAction === CollectionAction.COLLECT) {
      theme = 'filled';
    } else {
      theme = 'twoTone';
    }
  }

  return (
    <div className={styles.toolbar}>
      <Dropdown
        disabled={!note && primaryResult == null}
        overlay={
          note ? <></> : getMenu
          // <></>
        }>
        <Button
          type="link"
          shape="circle"
          ghost
          onClick={handleButtonClick}
        >
          <Icon
            type="heart"
            // style={{ color: heartColor }}
            theme={theme}
          />
        </Button>
      </Dropdown>
    </div>
  );

  function getMenu() {
    if (note) return <></>;
    else
      return (
        <Menu onClick={handleMenuClick}>
          <Menu.Item key="1">
            <Icon type="heart" theme="filled" style={{ color: heartColor }}/>
            收藏
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="heart" theme="twoTone" twoToneColor={heartColor}/>
            快速收藏
          </Menu.Item>
        </Menu>
      );
  }

  function handleButtonClick() {
    dispatch({
      type: 'searchToolBar/toggleCollect',
      payload: {
        note,
      },
    });
  }

  function handleMenuClick(param: ClickParam) {
    // dispatch({
    //
    // });
    console.log(param);
  }

}
