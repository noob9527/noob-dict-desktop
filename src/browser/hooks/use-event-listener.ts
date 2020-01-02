import { useEffect, useRef } from 'react';

const useEventListener = (eventName: string, handler: (event) => void, element: any = global) => {
  const savedHandler = useRef<((event: any) => void)>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      if (!element?.addEventListener) return;
      const eventListener = event => savedHandler.current?.call(null, event);
      element.addEventListener(eventName, eventListener);
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element],
  );
};

export default useEventListener;