import React, { KeyboardEvent, useRef } from 'react';
import styles from './search-input.module.scss';
import { Input, Select, Spin } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { SelectValue } from 'antd/es/select';
import { SearchInputState } from './search-input-model';
import { usePrevious } from '../../../hooks/use-previous';


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
  const previousFocusInput = usePrevious(focusInput);
  const selectEle = useRef<Select | null>(null);
  if (!previousFocusInput && focusInput) {
    selectEle?.current?.focus();
  }

  return (
    <div className={styles.searchHeaderInput}>
      <Select
        ref={selectEle}
        mode={Select.SECRET_COMBOBOX_MODE_DO_NOT_USE}
        onChange={onChange}
        onSearch={handleInputSearchText}
        onSelect={search}
        onFocus={() => {
          if (suggests.length) {
            setOpen(true);
          }
          dispatch({
            type: '_transient/mergeState',
            payload: { focusInput: true },
          });
        }}
        onBlur={() => {
          setOpen(false);
          dispatch({
            type: '_transient/mergeState',
            payload: { focusInput: false },
          });
        }}
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

