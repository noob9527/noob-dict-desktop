import React, { useState, KeyboardEvent } from 'react';
import styles from './search.module.scss';
import { Input, Select, Spin } from "antd";
import { useDispatch, useSelector } from 'dva';
import { SelectValue } from "antd/es/select";
import { SearchState } from "./search-domain";


export default () => {
  const dispatch = useDispatch();
  const text = useSelector((state: { search: SearchState }) => state.search.text);
  const suggests = useSelector((state: { search: SearchState }) => state.search.suggests);
  const loadingSuggests = useSelector((state: { search: SearchState }) => state.search.loadingSuggests);

  const [open, setOpen] = useState(false);

  return (
    <div className={styles.searchHeaderInput}>
      <Select
        mode={Select.SECRET_COMBOBOX_MODE_DO_NOT_USE}
        onChange={onChange}
        onSearch={fetchSuggests}
        onSelect={search}
        onFocus={() => {
          if (suggests.length) {
            setOpen(true);
          }
        }}
        onBlur={() => setOpen(false)}
        value={text}
        open={open}
        getInputElement={getInputElement}
        notFoundContent={loadingSuggests ? <Spin/> : null}
        size="large"
        dropdownClassName={styles.searchHeaderSelectDropdown}
      >
        {suggests.map(e => (
          <Select.Option key={e.entry}>
            <span>{e.entry}</span>
            <span>{e.explain}</span>
          </Select.Option>
        ))}
      </Select>
      {/*<div>isLoading: <span*/}
      {/*  style={{ backgroundColor: loadingSuggests ? 'green' : 'red' }}>{String(loadingSuggests)}</span></div>*/}
      {/*<div>open: <span style={{ backgroundColor: open ? 'green' : 'red' }}>{String(open)}</span></div>*/}
    </div>
  );

  function getInputElement() {
    return <Input.Search
      placeholder="input search text"
      onPressEnter={(e: KeyboardEvent<HTMLInputElement>) => {
        if (open) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          search((e.target as any).value);
        }
      }}
      onSearch={search}
    />;
  }

  function onChange(text: SelectValue) {
    if (text && !open) {
      setOpen(true);
    }
    dispatch({
      type: 'search/textChange',
      text
    });
  }

  function fetchSuggests(text: SelectValue) {
    dispatch({
      type: 'search/searchTextChange',
      text
    });
  }

  function search(text: SelectValue) {
    setOpen(false);
    dispatch({
      type: 'search/fetchResults',
      text
    });
  }
}

