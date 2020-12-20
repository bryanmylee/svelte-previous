import { writable } from 'svelte/store';

interface WithPrevious<T> {
  current: T,
  previous: T | null,
}

export function withPrevious<T>(initValue: T) {
  const values = writable<WithPrevious<T>>({
    current: initValue,
    previous: null,
  });
  return {
    subscribe: values.subscribe,
    setCurrent: (newValue: T) => {
      values.update(old => ({
        current: newValue,
        previous: old.current,
      }));
    },
  };
}

