export const swap = (arr: any[], index1: number, index2: number) => {
  const copy = arr.slice(0);
  const ele1 = arr[index1];
  const ele2 = arr[index2];
  copy[index1] = ele2;
  copy[index2] = ele1;
  return copy;
}