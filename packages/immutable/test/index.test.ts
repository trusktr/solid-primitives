import {
  update,
  concat,
  split,
  get,
  sortBy,
  merge,
  removeItems,
  filterInstance,
  filterOutInstance
} from "../src";
import { suite } from "uvu";
import * as assert from "uvu/assert";
import { cloneDeep } from "lodash";

const testUpdate = suite("update");

testUpdate("update()", () => {
  const original = {
    a: 123,
    b: { inner: { c: "yo", d: [0, 1, 2], fn: () => {} } },
    arr: [1, 2, 3]
  };
  const originalClone = cloneDeep(original);

  let captirePrev: any;
  const x = update(original, "a", prev => {
    captirePrev = prev;
    return "69";
  });
  assert.is(x.a, "69");
  assert.is(captirePrev, 123);

  const y = update(original, "b", "inner", "69");
  assert.is(y.b.inner, "69");

  const z = update(original, "b", "inner", "c", { aha: 123 });
  assert.is(z.b.inner.c.aha, 123);
  assert.equal(z.b.inner.d, [0, 1, 2]);

  const a = update(original, "arr", 0, "yoo");
  assert.equal(a.arr, ["yoo", 2, 3]);

  const fn = update(original, "b", "inner", "fn", () => () => 123);
  assert.is(fn.b.inner.fn(), 123);

  const theSame = update(original, "b", "inner", "c", "yo");
  assert.equal(theSame, originalClone, "no changes makes no changes");

  const fnUpdate = update(original, "b", "inner", "d", list => [...list, 3]);
  assert.equal(fnUpdate.b.inner.d, [0, 1, 2, 3], "item was added to the copy");
  assert.equal(original.b.inner.d, [0, 1, 2], "item should't be added to the original");

  assert.equal(original, originalClone, "original object should stay the same");
});

testUpdate.run();

const testConcat = suite("concat");

testConcat("concat()", () => {
  const originalArgs = [1, 2, ["a", "b"], "c", [3, [4, 5]]];
  const copiedArgs = cloneDeep(originalArgs);

  const a = concat(...originalArgs);
  assert.equal(a, [1, 2, "a", "b", "c", 3, [4, 5]]);
  assert.equal(originalArgs, copiedArgs);
});

testConcat.run();

const testSplit = suite("split");

testSplit("split()", () => {
  const original = { a: 123, b: "foo", c: { inner: 1 }, d: [1, 2, 3] };
  const originalCopy = cloneDeep(original);

  const [a, b] = split(original, "a", "c");
  assert.equal(a, { a: 123, c: { inner: 1 } });
  assert.equal(b, { b: "foo", d: [1, 2, 3] });

  const [c, d, e] = split(original, ["a"], ["c", "b"]);
  assert.equal(c, { a: 123 });
  assert.equal(d, { b: "foo", c: { inner: 1 } });
  assert.equal(e, { d: [1, 2, 3] });

  assert.equal(original, originalCopy);
});

testSplit.run();

const testGet = suite("get");

testGet("get()", () => {
  const original = {
    a: 123,
    b: "foo",
    c: { inner: { x: "baz" } },
    d: [1, 2, ["bar"]] as [number, number, string[]]
  };
  const originalCopy = cloneDeep(original);

  assert.is(get(original, "a"), 123);
  assert.is(get(original, "c", "inner", "x"), "baz");
  assert.is(get(original, "d", 2, 0), "bar");
  assert.equal(original, originalCopy);
});

testGet.run();

const testSortBy = suite("sortBy");

testSortBy("sortBy()", () => {
  const source = [
    { x: "b", y: 4 },
    { x: "a", y: 2 },
    { x: "b", y: 3 },
    { x: "a", y: 1 }
  ];

  assert.equal(
    sortBy(source, ({ x }) => x),
    [
      { x: "a", y: 2 },
      { x: "a", y: 1 },
      { x: "b", y: 4 },
      { x: "b", y: 3 }
    ]
  );

  assert.equal(sortBy(source, ["x", "y"]), [
    { x: "a", y: 1 },
    { x: "a", y: 2 },
    { x: "b", y: 3 },
    { x: "b", y: 4 }
  ]);

  assert.equal(
    sortBy(source, ({ y }) => y / 10),
    [
      { x: "a", y: 1 },
      { x: "a", y: 2 },
      { x: "b", y: 3 },
      { x: "b", y: 4 }
    ]
  );
});

testSortBy.run();

const testMerge = suite("merge");

testMerge("merges", () => {
  const a = { foo: "bar", arr: [1, 2, 3] };
  const a_copy = cloneDeep(a);
  const b = { foo: "baz", arr: [1, 2, 3], inner: { z: 123 } };
  const b_copy = cloneDeep(b);
  const c = { arr: [1, 2, 3, 4], inner: { z: 321 } };
  const c_copy = cloneDeep(c);
  const x = merge(a, b, c);
  assert.equal(a_copy, a);
  assert.equal(b_copy, b);
  assert.equal(c_copy, c);
  assert.equal(x, { foo: "baz", arr: [1, 2, 3, 4], inner: { z: 321 } });
});

testMerge.run();

const testRemoveItems = suite("removeItems");

testRemoveItems("", () => {
  const res = removeItems([1, 2, 3, 4, 5, 6, 7, 8, 9], 2, 6, 7, 11);
  assert.equal(res, [1, 3, 4, 5, 8, 9]);
});

testRemoveItems.run();

const testFilterInstance = suite("filterInstance");

testFilterInstance("*", () => {
  const num = 12345;
  const string = "hello";
  const el = document.createElement("div");
  const svg = document.createElement("svg");
  const list = [num, string, el, svg, string, null, undefined, NaN];
  const copy = [num, string, el, svg, string, null, undefined, NaN];

  const a = filterInstance(list, Element, Number);
  assert.equal(a, [num, el, svg]);
  const b = filterOutInstance(list, Element, Number);
  assert.equal(b, [string, string]);
  assert.equal(list, copy, "nonmutable");
});

testFilterInstance.run();
