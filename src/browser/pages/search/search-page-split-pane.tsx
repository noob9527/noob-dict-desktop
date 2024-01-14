import SplitPane from 'react-split-pane';
import styled from 'styled-components';
import ColorId from '../../styles/ColorId';

// see: https://github.com/tomkp/react-split-pane
const SearchPageSplitPane = styled(SplitPane)`
  // unset height: 100%
  // unset min-height: 100%
  height: unset !important;
  min-height: unset !important;

  // ---------------------------------
  // this part may not suit for general situation
  &.SplitPane {
    position: unset !important;
  }
  .Pane1 {
    height: 100%;
    overflow: hidden;
  }
  .Pane2 {
    display: unset !important;
  }
  // ---------------------------------
  .Resizer {
    //background: #000;
    background: ${props => props.theme[ColorId.foreground]};
    opacity: 0.2;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }
  
  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }
  
  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }
  
  .Resizer.horizontal:hover {
    //border-top: 5px solid rgba(0, 0, 0, 0.5);
    //border-bottom: 5px solid rgba(0, 0, 0, 0.5);
    border-top: 5px solid rgba(255, 255, 255, 0.5);
    border-bottom: 5px solid rgba(255, 255, 255, 0.5);
  }
  
  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }
  
  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
`;

export default SearchPageSplitPane;
