export function intersection(arr: string[], arr2: string[]) {
  const set1 = new Set(arr);
  const set2 = new Set(arr2);

  return set1.size < set2.size
    ? [...set1].filter((item) => set2.has(item))
    : [...set2].filter((item) => set1.has(item));
}
