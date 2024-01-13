import React, { useEffect } from 'react';
import styled from 'styled-components';
import ColorId from '../../styles/ColorId';
import { useDispatch, useSelector } from 'react-redux';
import { SearchState } from '../search/search-model';
import { Button, Icon } from 'antd';
import logger from '../../../electron-shared/logger';
import { rendererContainer } from "../../../common/container/renderer-container";
import { HomeUiService, SearchUiServiceToken } from "../../../common/services/home-ui-service";
import { ClipboardService, ClipboardServiceToken } from "../../../common/services/clipboard-service";
import { PopupUiService, PopupUiServiceToken } from "../../../common/services/popup-ui-service";
import { removeNormalizeStyle } from '../../utils/style-utils';

const Popup = styled.div`
  // https://electronjs.org/docs/api/frameless-window
  //-webkit-app-region: drag;
  //-webkit-user-select: none;

  width: 50px;
  height: 50px;
  background-color: black;
  color: white;
  
  display: flex;
  cursor: pointer;
  span {
    margin: auto;
  }
`;

const PopupPage = () => {
  // const dispatch = useDispatch();
  // const searchState: SearchState = useSelector((state: any) => state.search);
  // const { pinned } = searchState;

  const searchUiService = rendererContainer.get<HomeUiService>(SearchUiServiceToken);
  const clipboardService = rendererContainer.get<ClipboardService>(ClipboardServiceToken);
  const popupUiService = rendererContainer.get<PopupUiService>(PopupUiServiceToken);

  useEffect(() => {
    removeNormalizeStyle();
  });

  return (
    <Popup onClick={() => {
      searchUiService.search({ text: clipboardService.readSelectionText() });
      popupUiService.hide();
    }}>
      <span>T</span>
    </Popup>
  );
};

export default PopupPage;
