import React, { KeyboardEvent } from 'react';
import styles from './search-input.module.scss';
import { Input, Select, Spin } from "antd";
import { useDispatch, useSelector } from 'dva';
import { SelectValue } from "antd/es/select";
import { SearchInputState } from "./search-input-model";
import styled from 'styled-components';


export default () => {
  const dispatch = useDispatch();
  const {
    text,
    suggests,
    loadingSuggests,
    open,
  } = useSelector((state: { searchInput: SearchInputState }) => state.searchInput);

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
      onPressEnter={onPressEnter}
      onSearch={search}
    />;
  }

  function onPressEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (open && !loadingSuggests) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      search((e.target as any).value);
    }
  }

  function onChange(text: SelectValue) {
    if (text && !open) {
      setOpen(true);
    }
    dispatch({
      type: 'searchInput/mergeState',
      payload: {
        text,
        suggests: [],
      }
    });
  }

  function fetchSuggests(text: SelectValue) {
    dispatch({
      type: 'searchInput/searchTextChange',
      text
    });
  }

  function setOpen(open: boolean) {
    dispatch({
      type: 'searchInput/mergeState',
      payload: {
        open
      }
    });
  }

  function search(text: SelectValue) {
    setOpen(false);
    dispatch({
      type: 'searchPanel/fetchResults',
      text
    });
  }
}

