<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Primitives&background=tiles&project=Keyed" alt="Solid Primitives Keyed">
</p>

# @solid-primitives/keyed

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=for-the-badge)](https://lerna.js.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-primitives/keyed?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-primitives/keyed)
[![version](https://img.shields.io/npm/v/@solid-primitives/keyed?style=for-the-badge)](https://www.npmjs.com/package/@solid-primitives/keyed)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-2.json)](https://github.com/solidjs-community/solid-primitives#contribution-process)

Control Flow primitives and components that require specifying explicit keys to identify or rerender elements.

- [`mapKey`](#mapKey) - Reactively maps an array by specified key with a callback function - underlying helper for the `<Key>` control flow.
- [`Key`](#Key) - Creates a list of elements by mapping items by provided key.
- [`Rerun`](#Rerun) - Causes the children to rerender when the `on` changes.

## Installation

```bash
npm install @solid-primitives/keyed
# or
yarn add @solid-primitives/keyed
```

## `mapKey`

Reactively maps an array by specified key with a callback function - underlying helper for the [`<Key>`](#Key) control flow.

### How to use it

#### Import

```ts
import { mapKey } from "@solid-primitives/keyed";
```

#### Basic usage

The `mapKey` primitive takes 4 arguments:

- `list` - input list of values to map
- `keyFn` - key getter, items will be identified by it's value. changing the value is changing the item.
- `mapFn` - reactive function used to create mapped output item. Similar to `Array.prototype.map` but both item and index are signals, that could change over time.
- `options` - a fallback for when the input list is empty or missing _(Optional)_

```ts
const mapped = mapArray(source, (model, index) => {
  const [name, setName] = createSignal(model().name);
  const [description, setDescription] = createSignal(model().description);

  createComputed(() => {
    setName(model().name);
    setDescription(model().description);
  });

  return {
    id: model.id,
    get name() {
      return name();
    },
    get description() {
      return description();
    },
    get index() {
      return index();
    },
    setName,
    setDescription
  };
});
```

Notice that both the value and index arguments are singlas. Items are identified only by keys, it means that the items could be copied, replaced, changed, but as long as the key is the same, `mapKey` will treat it as the same item.

## `<Key>`

Creates a list of elements by mapping items by provided key. Similar to Solid's `<For>` and `<Index>`, but here, both value and index arguments are signals.

But changing the value does not rerender the element, only where the value is being used.

### How to use it

#### Import

```ts
import { Key } from "@solid-primitives/keyed";
```

#### Typical usage

Both `each` and `by` have to be provided. The `fallback` prop is optional, it will be displayed when the list in `each` is missing or empty.

```tsx
<Key each={items()} by={item => item.id} fallback={<div>No items</div>}>
  {item => <div>{item()}</div>}
</Key>
```

#### Key shortcut

prop `by` can also be an object key

```tsx
<Key each={items()} by="id">
```

#### Index argument

Second argument of the map function is an index signal.

```tsx
<Key each={items()} by="id">
  {(item, index) => <div data-index={index()}>{item()}</div>}
</Key>
```

### Demo

https://codesandbox.io/s/solid-primitives-keyed-key-demo-gh7gd?file=/index.tsx

## `<Rerun>`

Causes the children to rerender when the `on` key changes. Equivalent of `v-key` in vue, and `{#key}` in svelte.

### Import

```ts
import { Rerun } from "@solid-primitives/keyed";
```

### How to use it

You have to provide a `on` prop. Changing it, will cause the children to rerender.

```tsx
const [count, setCount] = createSignal(0);

// will rerender whole <button>, instead of just text
<Rerun on={count()}>
  <button onClick={() => setCount(p => ++p)}>{count()}</button>
</Rerun>;

// or pass a function
<Rerun on={() => count()}/>

// or an array of dependencies
<Rerun on={[count, name, length]}/>
```

#### Passing a function as children

You can treat `on` prop like sources argument of the Solid's `on` helper, and the children as the second, callback argument.

```tsx
<Rerun on={[count, className]}>
  {([count, className]) => (
    <button class={className} onClick={() => setCount(p => ++p)}>
      {count}
    </button>
  )}
</Rerun>
```

#### Using with Transition

`<Rerun>` can be used together with [`solid-transition-group`](#https://github.com/solidjs/solid-transition-group) to animate single component's transition, on state change.

```tsx
<Transition name="your-animation" mode="outin">
  <Rerun on={count()}>
    <button onClick={() => setCount(p => ++p)}>{count()}</button>
  </Rerun>
</Transition>
```

### DEMO

https://codesandbox.io/s/solid-primitives-keyed-rerun-demo-14vjr?file=/index.tsx

## Changelog

<details>
<summary><b>Expand Changelog</b></summary>

0.0.100

Initial release as a Stage-2 primitive.

</details>
