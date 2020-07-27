import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ColorId from '../../../styles/ColorId';
import { Select, Spin } from 'antd';
import styles from './inline-edit-text.module.scss';
import { ThemedInput } from '../../../components/themed-ui/input/input';
import { DataWrapper, SearchNoteState } from './search-note-model';
import { ISearchHistory } from '../../../../common/model/history';
import { SelectValue } from 'antd/es/select';
import { useDispatch, useSelector } from 'react-redux';

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
  span:nth-child(2) {
    font-size: 0.7em;
  }
`;

const Container = styled.div`
  .inline-edit-text-display {
    white-space: pre-line;
    span {
      // ellipsis
      display: inline-block;
      max-width: 95%;
      vertical-align: middle;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      border-bottom: 1px dashed ${props => props.theme[ColorId.foreground]};
      cursor: pointer;
      &:hover {
        font-style: italic;
      }
    }
  }
`;

const EditorContainer = styled.div`
`;

interface InlineEditTextProps {
  historyWrapper: DataWrapper<ISearchHistory>
  placeholder?: string
  onEditingChange?: (value: boolean) => void
  autoFocus?: boolean
}

const defaultProps: Partial<InlineEditTextProps> = {
  placeholder: '',
};

const InlineEditText: React.FC<InlineEditTextProps> = (props) => {
  const {
    historyWrapper,
    placeholder,
    onEditingChange,
    autoFocus,
  } = props;

  const dispatch = useDispatch();
  const noteState: SearchNoteState = useSelector((state: any) => state.searchNote);
  const { loadingSuggests } = noteState;
  const { editing } = historyWrapper;
  const value = historyWrapper.newData.context?.source ?? '';
  let { suggests } = noteState;
  // exclude current value
  suggests = suggests.filter(e => e !== value);

  const selectEle = useRef<any>(null);

  // i don't sure if this is the right way to handle this
  // refer to:
  // https://reactjs.org/docs/hooks-faq.html#how-do-lifecycle-methods-correspond-to-hooks
  // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state
  const [isEditing, setEditing] = useState(false);
  useEffect(() => {
    if (editing != null) {
      setEditing(editing);
    }
  }, [editing]);

  return (
    <Container>
      <div hidden={isEditing} className={'inline-edit-text-display'}>
          <span onClick={event => {
            if (onEditingChange) {
              onEditingChange(true);
            } else {
              setEditing(true);
            }
            // focus on select
            setTimeout(() => {
              if (autoFocus) {
                selectEle?.current?.focus();
              }
            }, 100);
          }}>{value}</span>
      </div>
      <EditorContainer hidden={!isEditing} className={'inline-edit-text-edit'}>
        <div className={styles.searchHeaderInput}>
          <Select
            ref={selectEle}
            mode={Select.SECRET_COMBOBOX_MODE_DO_NOT_USE}
            onChange={onChange}
            onSearch={handleInputSearchText}
            value={value}
            onFocus={() => {
              // fetch source suggests
              handleInputSearchText(value)
            }}
            getInputElement={getInputElement}
            notFoundContent={loadingSuggests ? <Spin/> : null}
            dropdownClassName={styles.searchHeaderSelectDropdown}
          >
            {suggests.map((e, i) => (
              <Select.Option key={e}>
                <Suggestion>
                  <span>{e}</span>
                </Suggestion>
              </Select.Option>
            ))}
          </Select>
        </div>
      </EditorContainer>
    </Container>
  );

  // 选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
  function onChange(text: SelectValue) {
    dispatch({
      type: 'searchNote/typeHistoryContext',
      payload: {
        history: {
          ...historyWrapper.newData,
          context: {
            ...historyWrapper.newData.context,
            source: text,
          },
        },
      },
    });
    dispatch({
      type: 'searchNote/searchTextChange',
      text,
    });
  }

  // 文本框值变化时回调
  function handleInputSearchText(text: SelectValue) {
    dispatch({
      type: 'searchNote/inputSearchText',
      text,
    });
  }

  function getInputElement() {
    return <ThemedInput placeholder={placeholder}/>;
  }
};

InlineEditText.defaultProps = defaultProps;

export { InlineEditText };

