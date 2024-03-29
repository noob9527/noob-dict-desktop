import React, { ReactElement, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ThemedTextArea } from '../../../components/themed-ui/input/textarea';
import ColorId from '../../../styles/ColorId';
import { usePrevious } from '../../../hooks/use-previous';

const Container = styled.div`
  .inline-edit-textarea-display {
    white-space: pre-line;
    > span {
      border-bottom: 1px dashed ${props => props.theme[ColorId.foreground]};
      cursor: pointer;
      &:hover {
        font-style: italic;
      }
    }
  }
`;

const EditorContainer = styled.div`
  position: relative;
  width: calc(100% - 21px);
  i.anticon-loading {
    position: absolute;
    right: -21px;
    top: calc(50% - 7px);

    transition: opacity 2s ease;
    opacity: 0;
    &.loading {
      opacity: 1;
    }
  }
`;

interface InlineEditTextareaProps {
  value?: string
  valueElement?: ReactElement,
  onChange?: (value) => void
  placeholder?: string
  editing?: boolean
  onEditingChange?: (value: boolean) => void
  autoFocus?: boolean
}

const defaultProps: InlineEditTextareaProps = {
  value: '',
  placeholder: '',
  editing: false,
};

const InlineEditTextarea: React.FC<InlineEditTextareaProps> = (props) => {
  const {
    value,
    valueElement,
    editing,
    placeholder,
    onChange,
    onEditingChange,
    autoFocus,
  } = props;

  const textAreaEle = useRef<any>(null);

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

  const displayValue = value?.trim()
    ? value : placeholder;

  return (
    <Container>
      <div hidden={isEditing} className={'inline-edit-textarea-display'}>
          <span onClick={event => {
            if (onEditingChange) {
              onEditingChange(true);
            } else {
              setEditing(true);
            }
            // focus on textArea
            setTimeout(() => {
              if (autoFocus) {
                textAreaEle?.current?.focus();
              }
            }, 100);
          }}>
            {valueElement ? valueElement : displayValue}
          </span>
      </div>
      <EditorContainer hidden={!isEditing} className={'inline-edit-textarea-edit'}>
        <ThemedTextArea
          ref={textAreaEle}
          value={value}
          placeholder={placeholder}
          autoSize={{ minRows: 1 }}
          // allowClear={true} // doesn't work since we have a blur handler
          onChange={e => onChange?.call(null, e.currentTarget.value)}
        />
      </EditorContainer>
    </Container>
  );
};

InlineEditTextarea.defaultProps = defaultProps;

export { InlineEditTextarea };
