import React, { KeyboardEvent, useEffect, useRef } from 'react';
import styles from './search-input.module.scss';
import { Input, Select, Spin } from 'antd';
import { SelectValue } from 'antd/es/select';
import { SearchInputState } from './search-input-model';
import { usePrevious } from '../../../hooks/use-previous';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { focusSearchInput } from '../../transient-store';

const Suggestion = styled.div`
  width: 100%;
  span {
    display: inline-block;
    width: 50%;
    
    // ellipsis
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  //span:nth-child(1) {
  //}
  span:nth-child(2) {
    font-size: 0.7em;
  }
`;


export default () => {
  const dispatch = useDispatch();
  const { focusInput } = useSelector((state: any) => state._transient);
  const {
    text,
    suggests,
    loadingSuggests,
    open,
  } = useSelector((state: { searchInput: SearchInputState }) => state.searchInput);

  // focus on input element
  const selectEle = useRef<Select | null>(null);
  const previousFocusInput = usePrevious(focusInput);
  useEffect(() => {
    if (!previousFocusInput && focusInput) {
      setTimeout(() => {
        selectEle?.current?.focus();
      }, 100);
    }
  }, [previousFocusInput, focusInput]);

  return (
    <div className={styles.searchHeaderInput}>
      <Select
        ref={selectEle}
        mode={Select.SECRET_COMBOBOX_MODE_DO_NOT_USE}
        onChange={onChange}
        onSearch={handleInputSearchText}
        onSelect={search}
        onFocus={() => {
          // I comment it because it's kinda annoying
          // when we show search window programmatically
          // open auto suggestion
          setOpen(true);
          // fetch suggest
          if (!suggests.length) {
            dispatch({
              type: 'searchInput/fetchSuggests',
              text,
            });
          }
          focusSearchInput()
        }}
        onBlur={() => {
          setOpen(false);
          focusSearchInput()
        }}
        value={text}
        open={open}
        // open={true}
        getInputElement={getInputElement}
        notFoundContent={loadingSuggests ? <Spin/> : null}
        dropdownClassName={styles.searchHeaderSelectDropdown}
      >
        {suggests.map((e, i) => (
          <Select.Option key={e.entry ? e.entry : i}>
            <Suggestion>
              <span>{e.entry}</span>
              <span>{e.explain}</span>
            </Suggestion>
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
      // placeholder="input search text"
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

  // 选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
  function onChange(text: SelectValue) {
    if (text && !open) {
      setOpen(true);
    }
    dispatch({
      type: 'searchInput/searchTextChange',
      text,
    });
  }

  // 文本框值变化时回调
  function handleInputSearchText(text: SelectValue) {
    dispatch({
      type: 'searchInput/inputSearchText',
      text,
    });
  }

  function setOpen(open: boolean) {
    dispatch({
      type: 'searchInput/mergeState',
      payload: {
        open,
      },
    });
  }

  function search(text: SelectValue) {
    setOpen(false);
    dispatch({
      type: 'searchPanel/fetchResults',
      text,
    });
  }
}

