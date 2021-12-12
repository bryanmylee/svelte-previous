import { get } from 'svelte/store';
import { usePrevious } from './index';

test('init', () => {
	// Arrange
	const [current, previous] = usePrevious(0);

	// Assert
	expect(get(current)).toBe(0);
	expect(get(previous)).toBeNull();
});

test('set one previous value', () => {
	// Arrange
	const [current, previous] = usePrevious(0);

	// Act and Assert
	current.set(1);
	expect(get(current)).toBe(1);
	expect(get(previous)).toBe(0);

	current.set(2);
	expect(get(current)).toBe(2);
	expect(get(previous)).toBe(1);
});

test('init two previous values', () => {
	// Arrange
	const [current, prev1, prev2] = usePrevious(0, { numToTrack: 2 });

	// Assert
	expect(get(current)).toBe(0);
	expect(get(prev1)).toBeNull();
	expect(get(prev2)).toBeNull();
});

test('set two previous values', () => {
	// Arrange
	const [current, prev1, prev2] = usePrevious(0, { numToTrack: 2 });

	// Act and Assert
	current.set(1);
	expect(get(current)).toBe(1);
	expect(get(prev1)).toBe(0);
	expect(get(prev2)).toBeNull();

	current.set(2);
	expect(get(current)).toBe(2);
	expect(get(prev1)).toBe(1);
	expect(get(prev2)).toBe(0);

	current.set(3);
	expect(get(current)).toBe(3);
	expect(get(prev1)).toBe(2);
	expect(get(prev2)).toBe(1);
});

test('init invalid no values', () => {
	expect(usePrevious.bind(this, 0, { numToTrack: 0 })).toThrow(
		'Must track at least 1 previous'
	);
});

test('update when equal', () => {
	// Arrange
	const [current, previous] = usePrevious(0, { requireChange: false });

	// Act and Assert
	current.set(1);
	current.set(1);
	expect(get(current)).toBe(1);
	expect(get(previous)).toBe(1);
});

test('no update when equal', () => {
	// Arrange
	const [current, previous] = usePrevious(0);

	// Act and Assert
	current.set(1);
	current.set(1);
	expect(get(current)).toBe(1);
	expect(get(previous)).toBe(0);
});

test('no update when equal object value', () => {
	// Arrange
	const first = { name: 'sam', age: 12 };
	const second = { name: 'john', age: 13 };
	const secondCopy = { name: 'john', age: 13 };
	const [current, previous] = usePrevious(first, {
		isEqual: (a, b) => a.name === b.name && a.age === b.age,
	});

	// Act and Assert
	current.set(second);
	current.set(secondCopy);
	expect(get(current)).toBe(second);
	expect(get(previous)).toBe(first);
});

test('update when equal object value, two previous values', () => {
	// Arrange
	const [current, prev1, prev2] = usePrevious(0, {
		numToTrack: 2,
		requireChange: false,
	});

	// Act and Assert
	current.set(0);
	current.set(0);
	expect(get(current)).toBe(0);
	expect(get(prev1)).toBe(0);
	expect(get(prev2)).toBe(0);
});
