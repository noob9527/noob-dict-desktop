import React, { KeyboardEvent, useRef, useState } from 'react';
import useEventListener from '../../../../hooks/use-event-listener';
import logger from '../../../../../electron-shared/logger';

const DIGIT_ZERO = 48;
const DIGIT_NINE = 57;
const KEY_A = 65;
const KEY_Z = 90;

interface InputShortcutProps {
  value?: string
  className?: string
  onChange?: (value?: string | null) => void;
}

const InputShortcut = (props: InputShortcutProps) => {
  const { value, onChange, className } = props;
  const [isChanging, setChanging] = useState(false);
  const buttonEle = useRef<HTMLButtonElement>(null);
  useEventListener('keydown', handleKeyDown, buttonEle.current ?? undefined);

  function handleKeyDown(event: KeyboardEvent<any>) {
    event.preventDefault();
    event.stopPropagation();
    if (!isChanging) return;
    if (!onChange) return;
    let key = '';

    if (event.key.toLowerCase().startsWith('esc')) {
      // cancel setting
      setChanging(false);
    } else if (event.key.toLowerCase().startsWith('backspace')) {
      // erase setting
      onChange(null);
      setChanging(false);
    } else if (isValidKey(event.keyCode)) {
      let prefix = '';
      if (event.metaKey) prefix += 'Meta+';
      if (event.ctrlKey) prefix += 'Ctrl+';
      if (event.shiftKey) prefix += 'Shift+';
      if (event.altKey) prefix += 'Alt+';
      key = prefix + event.key.toUpperCase();
      onChange(key);
      setChanging(false);
    } else {
      logger.debug('invalid key code', event);
    }
  }

  return (
    <button
      className={className}
      type={'button'}
      ref={buttonEle}
      onClick={() => setChanging(!isChanging)}>
      {isChanging ? 'press hotkey now' : (value ? value : 'unset')}
    </button>
  );
};

function isAlphabet(keyCode: number) {
  return keyCode >= KEY_A && keyCode <= KEY_Z;
}

function isNumber(keyCode: number) {
  return keyCode >= DIGIT_ZERO && keyCode <= DIGIT_NINE;
}

function isValidKey(keyCode: number) {
  return isAlphabet(keyCode) || isNumber(keyCode);
}


export { InputShortcut };
