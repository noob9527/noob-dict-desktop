import React from 'react';
import { ThemedInput } from '../../components/themed-ui/input/input';
import { ThemedTextArea } from '../../components/themed-ui/input/textarea';
import { InputNumber } from 'antd';
import { EditableText } from '../../components/themed-ui/input/editable-text';
import { DataWrapper } from '../../../common/model/data-wrapper';
import { type ISearchHistory } from '../../../common/model/history';

interface EditableCellProps {
  record: DataWrapper<ISearchHistory>
  value: string | number | undefined
  inputType: 'text' | 'text-area' | 'number'
  onChange?: (value: string | number | undefined) => void
}

export const EditableCell: React.FC<EditableCellProps> = (props) => {
  const {
    record,
    value,
    inputType,
    onChange,
  } = props;

  function renderInput() {
    switch (inputType) {
      case 'text':
        return (<ThemedInput value={value} onChange={e => {
          onChange?.call(null, e.target.value);
        }}/>);
      case 'text-area':
        return (<ThemedTextArea
          value={value}
          autoSize={{ minRows: 1 }}
          onChange={e => onChange?.call(null, e.target.value)}
        />);
      case 'number':
        return (<InputNumber value={value as number} onChange={e => onChange?.call(null, e)}/>);
    }
  }

  return (
    <EditableText
      editing={record.editing}
      renderInput={renderInput}
      renderText={() => <span>{value}</span>}
    />
  );
};
