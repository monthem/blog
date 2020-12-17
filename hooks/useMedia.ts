import React from "react";
import getMatchingScreen from "../utils/layout";

type UseMediaOption<T> = {
  [screen in ReturnType<typeof getMatchingScreen>]?: T;
} & {
  defaultValue?: T;
}

const useMedia = <T>(option: UseMediaOption<T>) => {
  const availableValue = option[Object.values(option).findIndex((value) => value !== undefined)];
  const defaultValue = option.defaultValue || availableValue;
  const [value, set] = React.useState<T>(defaultValue);
  React.useEffect(() => {
    const handler = (e: UIEvent) => {
      const matchingScreen = getMatchingScreen(window.innerWidth);
      const matchingValue = option[matchingScreen] || defaultValue;
      set(matchingValue);
    }
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [])
  return value || defaultValue;
}

export default useMedia;