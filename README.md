![svelte-previous-banner](https://user-images.githubusercontent.com/42545742/102723346-20ac5700-4342-11eb-978d-222a2f4109d5.png)

# svelte-previous

[![npm version](http://img.shields.io/npm/v/svelte-previous.svg)](https://www.npmjs.com/package/svelte-previous)
[![npm downloads](https://img.shields.io/npm/dm/svelte-previous.svg)](https://www.npmjs.com/package/svelte-previous)
![license](https://img.shields.io/npm/l/svelte-previous)
![build](https://img.shields.io/github/actions/workflow/status/bryanmylee/svelte-previous/publish.yml)
[![coverage](https://coveralls.io/repos/github/bryanmylee/svelte-previous/badge.svg?branch=master)](https://coveralls.io/github/bryanmylee/svelte-previous?branch=master)
[![size](https://img.shields.io/bundlephobia/min/svelte-previous)](https://bundlephobia.com/result?p=svelte-previous)

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

  export let name;
  // current is writable, while previous is read-only.
  const [currentName, previousName] = withPrevious(0);
  // To update the values, assign to the writable store.
  $: $currentName = name;
</script>

transition from {$previousName} to {$currentName}.
```

## Options

`withPrevious` takes an options object as its second argument.

### `numToTrack: number`

By default, `withPrevious` tracks one previous value.

To track more than one value, set `numToTrack`.

```svelte
<script>
  const [current, prev1, prev2] = withPrevious(0, { numToTrack: 2 });
</script>

from {$prev2} to {$prev1} to {$current}.
```

### `initPrevious: T[]`

To initialize previous values with something besides `null`, pass an array of values from newest to oldest.

Missing values will be filled with `null` and extra values will be ignored.

```svelte
<script>
  const [current, prev1, prev2] = withPrevious(0, { numToTrack: 2, initPrevious: [1, 2, 3] })
</script>

from {$prev2} to {$prev1} to {$current}. <!-- from 2 to 1 to 0. -->
```

### `requireChange: boolean`

Due to how reactivity is handled in Svelte, some assignments may assign the same value multiple times to a variable. Therefore, to prevent a single value from overwriting all previous values, a change in value is required before the current and previous values are updated.

Set `requireChange = false` to change this behaviour.

```ts
const [current, previous] = withPrevious(0, { requireChange: false });
```

### `isEqual: (a: T, b: T) => boolean`

By default, equality is determined with the `===` operator. However, `===` only checks equality by reference when comparing objects.

Provide a custom `isEqual` function to compare objects.

```ts
const [current, previous] = withPrevious(0, {
  isEqual: (a, b) => a.name === b.name && a.age === b.age,
});
```

It is also possible to use [lodash.isequal](https://www.npmjs.com/package/lodash.isequal).

```ts
import isEqual from 'lodash.isequal';

const [current, previous] = withPrevious(0, {
  isEqual: isEqual,
});
```
