import { writable, derived, Writable, Readable } from 'svelte/store';

interface WithPrevious<T> {
  current: T,
  previous: T | null,
}

type Updater<T> = (toUpdate: T) => T;

export function withPrevious<T>(initValue: T):
    [Writable<T>, Readable<T | null>] {
  const values = writable<WithPrevious<T>>({
    current: initValue,
    previous: null,
  });
  const updateCurrent = (fn: Updater<T>) => {
    values.update(old => {
      const newValue = fn(old.current);
      return {
        current: newValue,
        previous: old.current,
      };
    });
  }
  const current: Writable<T> = {
    subscribe: derived(values, $values => $values.current).subscribe,
    update: updateCurrent,
    set: (newValue) => {
      updateCurrent(() => newValue);
    },
  };
  const previous = derived(values, $values => $values.previous);
  return [current, previous];
}

