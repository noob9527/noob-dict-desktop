import React, { useEffect } from 'react';
import styled from 'styled-components';
import ColorId from '../../styles/ColorId';
import { useDispatch, useSelector } from 'react-redux';
import { SearchState } from '../search/search-model';
import { Button, Icon } from 'antd';
import logger from '../../../common/utils/logger';
import { rendererContainer } from "../../../common/container/renderer-container";
import { SearchUiService, SearchUiServiceToken } from "../../../common/services/search-ui-service";
import { ClipboardService, ClipboardServiceToken } from "../../../common/services/clipboard-service";
import { PopupUiService, PopupUiServiceToken } from "../../../common/services/popup-ui-service";

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

  const searchUiService = rendererContainer.get<SearchUiService>(SearchUiServiceToken);
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

function removeNormalizeStyle() {
  const res = Array.from(document.querySelectorAll('style'));
  const normalizeStyle = res.find(e => isNormalizeStyle(e.innerText));
  if (normalizeStyle) {
    logger.log('normalize css removed');
    normalizeStyle.parentNode?.removeChild(normalizeStyle);
  }
}

function isNormalizeStyle(text: String): boolean {
  const t = `
html,
body {
  width: 100%;
  height: 100%;
}`;
  return text.includes(t);
}

export default PopupPage;
