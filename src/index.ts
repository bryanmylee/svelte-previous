import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';

type NonNullFirstArray<T> = [T, ...(T|null)[]];
type Updater<T> = (toUpdate: T) => T;

export function withPrevious<T>(initValue: T, numToTrack: number = 1):
    [Writable<T>, ...Readable<T|null>[]] {
  if (numToTrack < 1) {
    throw new Error('Must track at least 1 previous');
  }
  // Generates an array of size numToTrack with the first element set to
  // initValue and all other elements set to null.
  const init: NonNullFirstArray<T>
      = [initValue, ...Array(numToTrack).fill(null)];
  const values = writable<NonNullFirstArray<T>>(init);
  const updateCurrent = (fn: Updater<T>) => {
    values.update($values => {
      const newValue = fn($values[0]);
      // Adds the new value to the front of the array and removes the oldest
      // value from the end.
      return [
        newValue,
        ...$values.slice(0, numToTrack),
      ];
    });
  }
  const current: Writable<T> = {
    subscribe: derived(values, $values => $values[0]).subscribe,
    update: updateCurrent,
    set: (newValue) => {
      updateCurrent(() => newValue);
    },
  };
  // Create an array of derived stores for every other element in the array.
  const others = [...Array(numToTrack)]
      .map((_, i) => derived(values, $values => $values[i + 1]));
  return [current, ...others];
}

