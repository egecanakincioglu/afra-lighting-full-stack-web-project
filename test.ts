import { mergeArraysToObjectArray } from "./src/lib/helpers/objects";

const result = mergeArraysToObjectArray({
  index: ["1", "2"],
  category: ["abc", "def"],
});

console.log(result);

const result2 = mergeArraysToObjectArray({
  index: ["a", "b"],
});

console.log(result2);
