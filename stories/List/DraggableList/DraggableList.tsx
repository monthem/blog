import React from 'react'
import { animated, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import { CSSProperties } from 'styled-components';
import { v4 } from 'uuid';
import { swap } from '../../../utils/array';
import utils, {SizeRect} from './utils';
const {
  checkIfOrderChanged,
  getCurIndex,
  getCurStartY,
  updateOrder,
  getY,
} = utils;

export type DraggableListProps<T=any> = {
  items?: T[];
  render?: (item: T, i: number) => JSX.Element;
  onOrderChanged?: (items: T[]) => any;
}
const animatedDivStyle: CSSProperties = {
  width: "fit-content",
  height: "fit-content",
}

/* Procedure
  1. get transformY by subtracting curY from originY. (Easy)
  2. get newIndex of drag target. (Hard)
  3. update order array. (Easy)
  4. arrange elements according to order array. (Easy)
  ~ The End ~
*/

/* Limitation
  1. rendered item should not include margin because DOMRect doesn't consider margin.
  So, if you want to apply margin, wrap your component which other div and give some padding to wrapper.
*/

const DraggableList: React.FC<DraggableListProps> = (props) => {
  const {
    items = [],
    render,
    onOrderChanged,
  } = props;
  const nodeId = React.useRef(v4()).current;
  const order = React.useRef(items.map((_, i) => i));
  const springs = React.useRef(items.map((_, i) => {
    const [spring, set] = useSpring(() => ({
      transform: `translate3d(0px, 0px, 0px) scale(1)`,
      zIndex: i,
    }))
    return {
      spring,
      set,
      originalIndex: i,
    }
  })).current;
  const containerRefs = React.useRef(items.map(() => React.useRef<HTMLDivElement>(null))).current;
  const rects = React.useRef<SizeRect[]>(items.map(() => ({
    height: -1,
    width: -1,
  }))).current;
  const y = React.useRef(items.map((_, index) => ({
    prevY: -1,
    curY: -1,
  }))).current;

  const bind = useGesture({
    onDragStart: (state) => {
      const {args} = state;
      const [originalIndex] = args;
      const yRef = y[originalIndex];
      yRef.prevY = yRef.curY;
    },
    onDrag: (state) => {
      const {args, initial, xy} = state;
      const [originalIndex] = args;
      const [diffX, diffY] = [xy[0]- initial[0], xy[1] - initial[1]];
      const yRef = y[originalIndex];
      yRef.curY = yRef.prevY + diffY;
      const {curY} = yRef;
      const originY = getY(rects, originalIndex);
      const transformY = yRef.curY - originY;
      const spring = springs[originalIndex];
      const newIndex = getCurIndex(order.current, rects, originalIndex, curY);
      const newOrder = updateOrder(order.current, originalIndex, newIndex);
      const orderHasChanged = checkIfOrderChanged(order.current, newOrder);
      if (orderHasChanged) {
        order.current = newOrder;
        const changedItemList = swap(items, originalIndex, newOrder.indexOf(originalIndex));
        if (onOrderChanged) onOrderChanged(changedItemList);
      }
      spring.set({
        transform: `translate3d(0px, ${transformY}px, 0px) scale(1.1)`,
        zIndex: items.length,
      });
      springs.forEach(({set, originalIndex}) => {
        if (originalIndex === args[0]) return;
        const curY = getCurStartY(order.current, rects, originalIndex);
        const originY = getY(rects, originalIndex);
        const transformY = curY - originY;
        set({
          transform: `translate3d(0px, ${transformY}px, 0px) scale(1)`
        })
      });
    },
    onDragEnd: (state) => {
      const {args, initial, xy} = state;
      const [originalIndex] = args;
      const spring = springs[originalIndex];
      const newIndex = order.current.indexOf(originalIndex);
      spring.set({
        zIndex: newIndex,
      });
      springs.forEach(({set, originalIndex}) => {
        const curY = getCurStartY(order.current, rects, originalIndex);
        const originY = getY(rects, originalIndex);
        const transformY = curY - originY;
        const yRef = y[originalIndex];
        yRef.prevY = yRef.curY;
        yRef.curY = curY;
        set({
          transform: `translate3d(0px, ${transformY}px, 0px) scale(1)`
        })
      });
    }
  })

  React.useEffect(() => {
    containerRefs.forEach((ref, originalIndex) => {
      if (!ref.current) return;
      rects[originalIndex] = ref.current.getBoundingClientRect()
      const yRef = y[originalIndex];
      yRef.prevY = getY(rects, originalIndex);
      yRef.curY = yRef.prevY;
    })
  }, [])

  if (!items || !render) return <></>;
  return (
    <>
      {items.map((item, i) => {
        const {spring} = springs[i];
        const ref = containerRefs[i];
        return (
          <animated.div
            {...bind(i)}
            key={`${nodeId}-draggable-item-${i}`}
            ref={ref}
            style={{...spring, ...animatedDivStyle, position: "relative"}}>
            {render(item, i)}
          </animated.div>
        )
      })}
    </>
  )
}

DraggableList.defaultProps = {
  items: [],
}

export default DraggableList
