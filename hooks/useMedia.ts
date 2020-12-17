import React from "react";

/**
 * @param queries defines css media query in descending order.
 * For example, ["(min-width: 1200px)", "(min-width: 900px)", "(min-width: 600px)"].
 * If matching query exists in front, later query will be ignored.
 * @param values defines returned value.
 * @param defaultValue defines fallback value.
 */
const useMedia = <T>(queries: string[], values: T[], defaultValue: T) => {
  const [value, set] = React.useState<T>(defaultValue);
  React.useEffect(() => {
    const handler = () => {
      const matchingValue = values[queries.findIndex((query) => matchMedia(query).matches)];
      set(matchingValue);
    }
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [])
  return value || defaultValue;
}

export default useMedia;