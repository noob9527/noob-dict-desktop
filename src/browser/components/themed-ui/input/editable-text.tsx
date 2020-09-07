import React from 'react';

interface EditableTextProps {
  editing: boolean
  onEditingChange?: (value: boolean) => void
  renderInput: () => React.ReactElement
  renderText: () => React.ReactElement
}

export const EditableText: React.FC<EditableTextProps> = (props: EditableTextProps) => {
  const {
    editing,
    renderInput,
    renderText,
  } = props;
  if (editing) {
    return renderInput();
  } else {
    return renderText();
  }
};
