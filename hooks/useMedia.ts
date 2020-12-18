import React from "react";
import getMatchingScreen, { ScreenSize } from "../utils/layout";

type UseMediaOption<T> = {
  [screen in ReturnType<typeof getMatchingScreen>]?: T;
} & {
  config?: {
    defaultValue?: T;
    delay?: number;
  }
}

const useMedia = <T>(option: UseMediaOption<T>): T | undefined => {
  const {config = {}} = option;
  const {delay = 0} = config;
  const keys = Object.keys(option) as ScreenSize[];
  const availableValueIndex = Object.values(option).findIndex((value) => value !== undefined);
  const availableValue = option[keys[availableValueIndex]];
  const defaultValue = option.config?.defaultValue || availableValue;
  const [value, set] = React.useState<T | undefined>(defaultValue);
  const prevValue = React.useRef(value);
  const update = React.useRef<number | null>(null);
  React.useEffect(() => {
    const handler = () => {
      const matchingScreen = getMatchingScreen(window.innerWidth);
      const matchingValue = option[matchingScreen] || defaultValue;
      if (prevValue.current !== matchingValue) {
        if (update.current !== null) clearTimeout(update.current);
        update.current = setTimeout(() => {
          prevValue.current = matchingValue;
          set(matchingValue);
        }, delay)
      }
    }
    handler();
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      if (update.current) clearTimeout(update.current);
    }
  }, [])
  return value || defaultValue;
}

export default useMedia;