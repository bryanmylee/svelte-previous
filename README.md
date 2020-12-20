# svelte-previous

Svelte stores that remember previous values!

This allows us to perform actions that depend on previous values, such as transitions between old and new values.

## Installation

```bash
$ npm i -D svelte-previous
```

Since Svelte automatically bundles all required dependencies, you only need to install this package as a dev dependency with the -D flag.

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

### Multiple previous values

To track more than one value, pass the number of previous values to track as the second argument to `withPrevious`.

```svelte
<script>
  const [current, prev1, prev2] = withPrevious(0, 2);
  setInterval(() => $current++, 1000);
</script>

from {$prev2} to {$prev1} to {$current}.
```

