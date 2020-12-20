# svelte-previous

Svelte stores that remember previous values!

This allows us to perform actions that depend on previous values, such as transitions between old and new values.

## Installation

```bash
$ npm i -D svelte-previous
```

Since Svelte automatically bundles all required dependencies, you only need to install this package as a dev dependency with the -D flag.

## Demo

Visit the [REPL demo](https://svelte.dev/repl/1d3e752c51b848e6af264f3244f3e85c?version=3.31.0).

## Usage

`withPrevious` accepts an initial value, and returns a tuple comprising a [Writable](https://svelte.dev/tutorial/writable-stores) and a [Readable](https://svelte.dev/tutorial/readable-stores) store.

```svelte
<script>
  import { withPrevious } from 'svelte-previous';
  // current is writable, while previous is read-only.
  const [current, previous] = withPrevious(0);
  // To update the values, assign to the writable store.
  setInterval(() => $current++, 1000);
</script>

from {$previous} to {$current}.
```

## Options

`withPrevious` takes an options object as its second argument.

### `numToTrack: number`

By default, `withPrevious` tracks one previous value.

To track more than one value, set `numToTrack`.

```svelte
<script>
  const [current, prev1, prev2] = withPrevious(0, { numToTrack: 2 });
  setInterval(() => $current++, 1000);
</script>

from {$prev2} to {$prev1} to {$current}.
```

### `requireChange: boolean`

Due to how reactivity is handled in Svelte, some assignments may assign the same value multiple times to a variable. Therefore, to prevent a single value from overwriting all previous values, a change in value is required before the current and previous values are updated.

Set `requireChange = false` to change this behaviour.

```svelte
<script>
  const [current, previous] = withPrevious(0, { requireChange: false });
</script>
```

### `isEqual: (a: T, b: T) => boolean`

By default, equality is determined with the `===` operator. However, `===` only checks equality by reference when comparing objects.

Provide a custom `isEqual` function to compare objects.

```svelte
<script>
  const [current, previous] = withPrevious(0, {
    isEqual: (a, b) => a.name === b.name && a.age === b.age,
  });
</script>
```

It is also possible to use [lodash.isequal](https://www.npmjs.com/package/lodash.isequal).

```svelte
<script>
  import isEqual from 'lodash.isequal';

  const [current, previous] = withPrevious(0, {
    isEqual: isEqual,
  });
</script>
```

