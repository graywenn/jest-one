export function getNumberFromString(value: string): number {
  return parseInt(value.match(/\.?\d/g).join(''), 10);
}

export function getFloatFromString(value: string): number {
  return parseFloat(value.match(/\.?\d/g)!.join(''));
}

export function isMandarin(value: string) {
  const pattern = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
  return !!pattern.exec(value);
}

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const random = () => Math.round(Math.random() * 10000);

export const lowerLetters = [...Array(26)].map((_, i) =>
  String.fromCharCode(i + 97)
);
