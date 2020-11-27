type ConditionDescriber = [boolean, string];
type TestConditionParams = ConditionDescriber[];

export const isAllTrue = (params: TestConditionParams) => {
  const lies = params.filter((describer) => {
    const [isTrue, description] = describer;
    if (isTrue) return false;
    return true;
  });
  return lies.length === 0;
}

export const isAllFalse = (params: TestConditionParams) => {
  const lies = params.filter((describer) => {
    const [isFalse, description] = describer;
    if (isFalse) return false;
    return true;
  });
  return lies.length === 0;
}