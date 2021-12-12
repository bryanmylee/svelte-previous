import { writable, derived } from 'svelte/store';
import type { Writable, Readable, Updater } from 'svelte/store';

interface WithPreviousOptions<T> {
	numToTrack?: number;
	requireChange?: boolean;
	isEqual?: IsEqual<T>;
}
type IsEqual<T> = (a: T, b: T) => boolean;
type NonNullFirstArray<T> = [T, ...(T | null)[]];

export function withPrevious<T>(
	initValue: T,
	{
		numToTrack = 1,
		requireChange = true,
		isEqual = (a, b) => a === b,
	}: Partial<WithPreviousOptions<T>> = {}
): [Writable<T>, ...Readable<T | null>[]] {
	if (numToTrack <= 0) {
		throw new Error('Must track at least 1 previous');
	}

	// Generates an array of size numToTrack with the first element set to
	// initValue and all other elements set to null.
	const rest = Array(numToTrack).fill(null);
	const values = writable<NonNullFirstArray<T>>([initValue, ...rest]);
	const updateCurrent = (fn: Updater<T>) => {
		values.update(($values) => {
			const newValue = fn($values[0]);
			// Prevent updates if values are equal as defined by an isEqual
			// comparison. By default, use a simple === comparison.
			if (requireChange && isEqual(newValue, $values[0])) {
				return $values;
			}
			// Adds the new value to the front of the array and removes the oldest
			// value from the end.
			return [newValue, ...$values.slice(0, numToTrack)];
		});
	};
	const current = {
		subscribe: derived(values, ($values) => $values[0]).subscribe,
		update: updateCurrent,
		set: (newValue: T) => {
			updateCurrent(() => newValue);
		},
	};
	// Create an array of derived stores for every other element in the array.
	const others = [...Array(numToTrack)].map((_, i) =>
		derived(values, ($values) => $values[i + 1])
	);
	return [current, ...others];
}

/**
 * @deprecated Since version 2.0.1. Use `withPrevious` instead.
 */
export const usePrevious = withPrevious;
