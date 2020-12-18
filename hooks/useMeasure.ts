import React from "react";
import ResizeObserver from 'resize-observer-polyfill';

export type ObserverRect = Pick<DOMRect, "left" | "top" | "width" | "height">;
type MeasureResult<T extends Element> = [{ref: React.RefObject<T>}, ObserverRect];
type MeasureOption = {
  /**@param delay this is used for preventing too many updates.*/
  delay?: number;
  onMeasureEnd?: (rect: ObserverRect) => any;
  onMeasureStart?: () => any;
}

const useMeasure = <T extends HTMLElement>(option?: MeasureOption): MeasureResult<T> => {
  const {delay = 0, onMeasureEnd, onMeasureStart} = option || {};
  const ref = React.useRef<T>(null);
  const [bounds, set] = React.useState<ObserverRect>({left: 0, height: 0, top: 0, width: 0});
  const latestUpdate = React.useRef<number | null>(null);
  const ro = React.useRef(new ResizeObserver(([entry]) => {
    if (onMeasureStart) onMeasureStart();
    if (latestUpdate.current) clearTimeout(latestUpdate.current);
    latestUpdate.current = setTimeout(() => {
      set(entry.contentRect);
      if (onMeasureEnd) onMeasureEnd(entry.contentRect);
    }, delay)
  })).current;
  React.useEffect(() => {
    if (ref.current) ro.observe(ref.current);
    return () => {
      ro.disconnect();
      if (latestUpdate.current) clearTimeout(latestUpdate.current);
    };
  }, []);
  return [{ref}, bounds];
}

export default useMeasure