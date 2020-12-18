const updateOrder = (order: number[], originalIndex: number, newIndex: number) => {
  const result = order.slice(0);
  const targetEleIndex = order.indexOf(originalIndex);
  const targetEle = order[targetEleIndex];
  const prevEle = order[newIndex];
  result[newIndex] = targetEle;
  result[targetEleIndex] = prevEle;
  return result;
}

const checkIfOrderChanged = (order1: number[], order2: number[]) => {
  if (order1.length !== order2.length) throw new Error("Item length has been changed!");
  for (let i = 0; i < order1.length; i += 1) {
    const ele1 = order1[i];
    const ele2 = order2[i];
    if (ele1 !== ele2) return true;
  }
  return false;
}

export type SizeRect = Pick<DOMRect, "width" | "height">;

const getY = (rects: SizeRect[], rectIndex: number) => {
  const result = rects.reduce((acc, rect, i) => {
    if (i >= rectIndex) return acc;
    return acc + rect.height;
  }, 0)
  return result;
}

const getYDescription = (updatedOrder: number[], rects: SizeRect[]) => {
  const reorderedRects = updatedOrder.map((originalIndex) => rects[originalIndex]);
  const yDescription = reorderedRects.map((rect, i) => {
    const startY = getY(reorderedRects, i);
    const endY = i < reorderedRects.length ? getY(reorderedRects, i + 1) : startY + rect.height;
    return {
      startY,
      endY,
      centerY: (startY + endY) / 2,
      height: rect.height,
      width: rect.width,
    }
  });
  return yDescription;
}

const getCurIndex = (updatedOrder: number[], rects: SizeRect[], originalIndex: number, curY: number) => {
  const yDescription = getYDescription(updatedOrder, rects);
  const selectedRect = yDescription[updatedOrder.indexOf(originalIndex)];
  const direction = curY > selectedRect.startY ? "down" : "up";
  const curIndex = updatedOrder.indexOf(originalIndex);
  const compareTargetOriginalIndex = direction === "down" 
    ? updatedOrder[curIndex < updatedOrder.length - 1 ? curIndex + 1 : curIndex]
    : originalIndex;
  const expectedOrder = direction === "down"
    ? updateOrder(updatedOrder, originalIndex, curIndex < updatedOrder.length - 1 ? curIndex + 1 : curIndex)
    : updateOrder(updatedOrder, originalIndex, curIndex > 0 ? curIndex - 1 : curIndex);
  const expectedYDescription = getYDescription(expectedOrder, rects);
  const expectedThreshold = direction === "down"
    ? expectedYDescription[expectedOrder.indexOf(compareTargetOriginalIndex)].endY
    : expectedYDescription[expectedOrder.indexOf(originalIndex)].startY;
  const hasPassedThreshold = direction === "down"
    ? curY > expectedThreshold
    : curY < expectedThreshold;
  const nextIndex = hasPassedThreshold
    ? direction === "down"
      ? curIndex < updatedOrder.length - 1 ? curIndex + 1 : curIndex
      : curIndex > 0 ? curIndex - 1 : curIndex
    : curIndex;
  // const nextOrder = updateOrder(updatedOrder, originalIndex, nextIndex);
  return nextIndex;
}

const getCurStartY = (updatedOrder: number[], rects: SizeRect[], targetOriginalIndex: number) => {
  const yDescription = getYDescription(updatedOrder, rects);
  return yDescription[updatedOrder.indexOf(targetOriginalIndex)].startY;
}

export default {
  updateOrder,
  checkIfOrderChanged,
  getY,
  getCurIndex,
  getCurStartY,
}