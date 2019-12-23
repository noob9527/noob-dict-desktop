import React, { KeyboardEvent, useRef, useState } from 'react';
import useEventListener from '@use-it/event-listener';

const DIGIT_ZERO = 48;
const DIGIT_NINE = 57;
const KEY_A = 65;
const KEY_Z = 90;

interface InputShortcutProps {
  value?: string
  className?: string
  onChange?: (value?: string) => void;
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
      setChanging(false);
    }

    if (isValidKey(event.keyCode)) {
      let prefix = '';
      if (event.ctrlKey) prefix += 'Ctrl+';
      if (event.shiftKey) prefix += 'Shift+';
      if (event.altKey) prefix += 'Alt+';
      key = prefix + event.key.toUpperCase();
      onChange(key);
      setChanging(false);
    } else {
      console.debug('invalid key code', event);
    }
  }

  return (
    <button className={className} type={'button'} ref={buttonEle} onClick={() => setChanging(!isChanging)}>
      {isChanging ? '?' : (value ? value : '?')}
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