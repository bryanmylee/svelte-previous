import { withPrevious } from './index';

test('init', () => {
  // Arrange
  const value = withPrevious(0);

  // Assert
  value.subscribe(v => {
    expect(v.current).toEqual(0);
    expect(v.previous).toBeNull();
  })
});

test('set one value', () => {
  // Arrange
  const value = withPrevious(0);

  // Act
  value.setCurrent(1);

  // Assert
  value.subscribe(v => {
    expect(v.current).toEqual(1);
    expect(v.previous).toEqual(0);
  })
});

