import React from "react";
import ResizeObserver from 'resize-observer-polyfill';

type ObserverRect = Pick<DOMRect, "left" | "top" | "width" | "height">

const useMeasure = <T extends HTMLElement>() => {
  const ref = React.useRef<T>();
  const [bounds, set] = React.useState<ObserverRect>({left: 0, height: 0, top: 0, width: 0});
  const [ro] = React.useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)));
  React.useEffect(() => (ro.observe(ref.current), ro.disconnect), []);
  return [{ref}, bounds];
}

export default useMeasure