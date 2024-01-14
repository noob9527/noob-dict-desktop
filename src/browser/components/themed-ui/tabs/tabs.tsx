/**
 * @see https://github.com/reactjs/react-tabs?tab=readme-ov-file#custom-components
 */
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import './tabs.css';
import styled from 'styled-components';
import ColorId from '../../../styles/ColorId';


const CustomTab = (props) => (
  <Tab {...props}/>
);

const CustomTabPanel = (props) => (
  <TabPanel {...props}/>
);

const CustomTabList = (props: any) => {
  // const newProp = {
  //   ...props,
  //   className: props.className + ' ' + TabList.defaultProps.className,
  // };
  return (
    // <TabList {...newProp}/>
    <TabList {...props}/>
  );
};

const StyledTabList = styled(CustomTabList)`
  background-color: ${props => props.theme[ColorId.tab_inactiveBackground]};
  color: ${props => props.theme[ColorId.tab_inactiveForeground]};
  
  // tab-list
  //border-bottom: 1px solid #aaa;
  margin: 0 0 10px;
  padding: 0;
  
  .react-tabs__tab {
    display: inline-block;
    //border: 1px solid transparent;
    border-bottom: none;
    //bottom: -1px;
    position: relative;
    list-style: none;
    padding: 6px 12px;
    cursor: pointer;
  }
  
  .react-tabs__tab--selected {
    background-color: ${props => props.theme[ColorId.tab_activeBackground]};
    color: ${props => props.theme[ColorId.tab_activeForeground]};
    //border-color: #aaa;
  }
  
  .react-tabs__tab--disabled {
    color: GrayText;
    cursor: default;
  }
  
  .react-tabs__tab:focus {
    //box-shadow: 0 0 5px hsl(208, 99%, 50%);
    //border-color: hsl(208, 99%, 50%);
    outline: none;
  }
  
  //.react-tabs__tab:focus:after {
  //  content: "";
  //  position: absolute;
  //  height: 5px;
  //  left: -4px;
  //  right: -4px;
  //  bottom: -5px;
  //  background: #fff;
  //}
  
  .react-tabs__tab-panel {
    display: none;
  }
  
  .react-tabs__tab-panel--selected {
    display: block;
  }
`;

CustomTab.tabsRole = 'Tab';
CustomTabPanel.tabsRole = 'TabPanel';
CustomTabList.tabsRole = 'TabList';

StyledTabList.tabsRole = 'TabList';

export {
  // StyledTabs as Tabs,
  // StyledTab as Tab,
  // StyledTabPanel as TabPanel,
  Tabs,
  CustomTab as Tab,
  CustomTabPanel as TabPanel,

  StyledTabList as TabList,
  // CustomTabList as TabList,
};
