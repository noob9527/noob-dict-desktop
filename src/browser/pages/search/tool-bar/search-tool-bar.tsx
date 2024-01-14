import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Icon } from 'antd'
import styled from 'styled-components'
import { SearchState } from '../search-model'
import { ThemedTooltip } from '../../../components/themed-ui/tooltip/tooltip'
import { AvatarDropDown } from './avatar-drop-down'
import { SyncActions, useSyncStore } from '../../sync/sync-store'

const ToolBar = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-right: 10px;
  }
  i.anticon-pushpin {
    font-size: 1.1em;
  }
`


export default () => {
  const dispatch = useDispatch();
  const searchState: SearchState = useSelector((state: any) => state.search);
  const { pinned } = searchState;
  const isSyncing = useSyncStore.use.isSyncing()

  return (
    <ToolBar>
      {/*<Button*/}
      {/*  type="link"*/}
      {/*  shape="circle"*/}
      {/*  onClick={() => {*/}
      {/*    popupUiService.show();*/}
      {/*    // dispatch({*/}
      {/*    //   type: 'popup/show',*/}
      {/*    // });*/}
      {/*  }}*/}
      {/*  ghost*/}
      {/*>*/}
      {/*  <Icon*/}
      {/*    type="smile"*/}
      {/*  />*/}
      {/*</Button>*/}
      {/*<ThemedTooltip title={'setting'}>*/}
      {/*  <Button*/}
      {/*    type="link"*/}
      {/*    shape="circle"*/}
      {/*    onClick={() => {*/}
      {/*      dispatch({*/}
      {/*        type: '_transient/openSettingWindow',*/}
      {/*      });*/}
      {/*    }}*/}
      {/*    ghost*/}
      {/*  >*/}
      {/*    <Icon*/}
      {/*      type="setting"*/}
      {/*    />*/}
      {/*  </Button>*/}
      {/*</ThemedTooltip>*/}
      <ThemedTooltip placement="bottom" title={'sync search history'}>
        <Button
          tabIndex={-1}
          type="link"
          shape="circle"
          onClick={() => {
            SyncActions.openSyncWindow()
          }}
          ghost
        >
          <Icon
            type="sync"
            spin={isSyncing}
          />
        </Button>
      </ThemedTooltip>
      <ThemedTooltip placement="bottom" title={'pin window'}>
        <Button
          tabIndex={-1}
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
      </ThemedTooltip>
      <AvatarDropDown/>
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
