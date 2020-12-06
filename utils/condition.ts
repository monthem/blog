export const isAllTrue = (conditions: boolean[]) => {
  return conditions.filter((isTrue) => isTrue).length === conditions.length;
}

export const isAllFalse = (conditions: boolean[]) => {
  return conditions.filter((isTrue) => !isTrue).length === conditions.length;
}

export const isAny = (conditions: boolean[]) => !isAllFalse(conditions);
