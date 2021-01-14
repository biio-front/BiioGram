import { useCallback, useState } from 'react';

export const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    [value],
  );
  return [value, handler, setValue];
};
