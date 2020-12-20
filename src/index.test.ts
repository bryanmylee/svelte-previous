import { get } from 'svelte/store';
import { withPrevious } from './index';

test('init', () => {
  // Arrange
  const [current, previous] = withPrevious(0);

  // Assert
  expect(get(current)).toBe(0);
  expect(get(previous)).toBeNull();
});

test('set one value', () => {
  // Arrange
  const [current, previous] = withPrevious(0);

  // Act
  current.set(1);

  // Assert
  expect(get(current)).toBe(1);
  expect(get(previous)).toBe(0);
});

