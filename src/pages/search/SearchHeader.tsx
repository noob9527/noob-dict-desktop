import React, { KeyboardEventHandler, useState } from 'react';
import { AutoComplete, Input } from "antd";
import { Suggest } from 'noob-dict-core';
import { useDispatch, useSelector } from 'dva';
import { SelectValue } from "antd/es/select";

const { Search } = Input;

export default () => {
  const dispatch = useDispatch();
  const dataSource = useSelector((state: any) => state.search.suggests)
    .map((e: Suggest) => e.entry);

  const [open, setOpen] = useState(false);

  // 请使用 onChange 进行受控管理。onSearch 触发于搜索输入，与 onChange 时机不同。
  // 此外，点选选项时也不会触发 onSearch 事件。
  const onChange = (text: SelectValue) => {
    dispatch({
      type: 'search/textChange',
      text
    });
  };
  const onSearchSuggests = (text: string) => {
    if (text.trim().length) setOpen(true);
    dispatch({
      type: 'search/searchTextChange',
      text
    });
  };
  // 在选中 suggest 时触发 search
  const onSelect = (text: SelectValue) => {
    setOpen(false);
    search(text as string);
  };
  // 在选项未打开时按 enter 触发 search
  const onSearch = (text: string) => {
    // if (text && !open) search(text);
    if (text) search(text);
  };

  const onPressEnter: KeyboardEventHandler = (e) => {
    if (open) e.preventDefault();
  };

  function search(text: string) {
    dispatch({
      type: 'search/fetchHtml',
      text
    });
  }

  return (
    <>
      <AutoComplete
        onChange={onChange}
        onSearch={onSearchSuggests}
        onSelect={onSelect}
        open={open}
        dataSource={dataSource}
      >
        <Search
          placeholder={"input search text"}
          onSearch={onSearch}
          onPressEnter={onPressEnter}
        />
        {/*{dataSource.map((suggest: Suggest) => {*/}
        {/*  return (*/}
        {/*    <AutoComplete.Option key={suggest.entry}>*/}
        {/*      {suggest.entry}*/}
        {/*    </AutoComplete.Option>*/}
        {/*  );*/}
        {/*})}*/}
      </AutoComplete>
    </>
  );
}
