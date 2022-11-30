import { get } from 'svelte/store';
import { withPrevious } from './index';

describe('initialization', () => {
	it('initializes the current and previous null value', () => {
		// Arrange
		const [current, previous] = withPrevious(0);

		// Assert
		expect(get(current)).toBe(0);
		expect(get(previous)).toBeNull();
	});

	it('initializes the current and two previous null values', () => {
		// Arrange
		const [current, prev1, prev2] = withPrevious(0, { numToTrack: 2 });

		// Assert
		expect(get(current)).toBe(0);
		expect(get(prev1)).toBeNull();
		expect(get(prev2)).toBeNull();
	});

	it('throws an error if no values are tracked', () => {
		expect(withPrevious.bind(this, 0, { numToTrack: 0 })).toThrow(
			'Must track at least 1 previous'
		);
	});
	describe('with initial previous values', () => {
		it('initializes multiple previous values', () => {
			// Arrange
			const [current, prev1, prev2] = withPrevious(0, {
				numToTrack: 2,
				initPrevious: [1, 2],
			});

			// Assert
			expect(get(current)).toBe(0);
			expect(get(prev1)).toBe(1);
			expect(get(prev2)).toBe(2);
		});

		it('initializes fewer previous values than tracked', () => {
			// Arrange
			const [current, prev1, prev2] = withPrevious(0, {
				numToTrack: 2,
				initPrevious: [1],
			});

			// Assert
			expect(get(current)).toBe(0);
			expect(get(prev1)).toBe(1);
			expect(get(prev2)).toBeNull();
		});

		it('initializes more previous values than tracked', () => {
			// Arrange
			const [current, prev1, prev2] = withPrevious(0, {
				numToTrack: 2,
				initPrevious: [1, 2, 3, 4],
			});

			// Assert
			expect(get(current)).toBe(0);
			expect(get(prev1)).toBe(1);
			expect(get(prev2)).toBe(2);
		});
	});
});

describe('update previous', () => {
	it('sets one previous value', () => {
		// Arrange
		const [current, previous] = withPrevious(0);

		// Act and Assert
		current.set(1);
		expect(get(current)).toBe(1);
		expect(get(previous)).toBe(0);

		current.set(2);
		expect(get(current)).toBe(2);
		expect(get(previous)).toBe(1);
	});

	it('sets two previous values', () => {
		// Arrange
		const [current, prev1, prev2] = withPrevious(0, { numToTrack: 2 });

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
});

describe('equality', () => {
	it('updates even if the values are equal', () => {
		// Arrange
		const [current, previous] = withPrevious(0, { requireChange: false });

		// Act and Assert
		current.set(1);
		current.set(1);
		expect(get(current)).toBe(1);
		expect(get(previous)).toBe(1);
	});

	it('updates multiple previous values even if the values are equal', () => {
		// Arrange
		const [current, prev1, prev2] = withPrevious(0, {
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

	it('does not update if the values are equal', () => {
		// Arrange
		const [current, previous] = withPrevious(0);

		// Act and Assert
		current.set(1);
		current.set(1);
		expect(get(current)).toBe(1);
		expect(get(previous)).toBe(0);
	});

	it('does not update if object values are equal based on `isEqual`', () => {
		// Arrange
		const first = { name: 'sam', age: 12 };
		const second = { name: 'john', age: 13 };
		const secondCopy = { name: 'john', age: 13 };
		const [current, previous] = withPrevious(first, {
			isEqual: (a, b) => a.name === b.name && a.age === b.age,
		});

		// Act and Assert
		current.set(second);
		current.set(secondCopy);
		expect(get(current)).toBe(second);
		expect(get(previous)).toBe(first);
	});

	it('updates if object values are different based on `isEqual`', () => {
		// Arrange
		const first = { name: 'sam', age: 12 };
		const [current, previous] = withPrevious(first, {
			isEqual: (a, b) => a.name === b.name && a.age === b.age,
		});

		// Act
		current.update(($current) => ({ ...$current, age: 13 }));

		// Assert
		expect(get(current)).toEqual({ name: 'sam', age: 13 });
		expect(get(previous)).toEqual({ name: 'sam', age: 12 });
	});
});
