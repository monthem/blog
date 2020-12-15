import chroma from 'chroma-js'
import { animate, clamp } from 'popmotion'
import React, { RefObject, useRef } from 'react'
import { animated, useSpring, useSprings } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import styled from 'styled-components'
import { v4 } from 'uuid'

type DraggableListProps = {
  items?: string[];
}

const buttonHeight = 60;

const ItemContainer = styled.div`
  width: 200px;
  height: ${buttonHeight}px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid blue;
  color: white;
  user-select: none;
  padding: 0%;
  box-sizing: border-box;
  font-weight: 900;
`;

const update = (arr: any[], originalIndex: number, newIndex: number) => {
  const result = arr.slice(0);
  const targetEleIndex = arr.indexOf(originalIndex);
  const targetEle = arr[targetEleIndex];
  const prevEle = arr[newIndex];
  result[newIndex] = targetEle;
  result[targetEleIndex] = prevEle;
  return result;
}

/* Limitation
  1. Item size should be same for each.
  2. Item height should be predicted before renderding items.
*/

const LegacyDraggableList: React.FC<DraggableListProps> = (props) => {
  const {items} = props;
  const nodeId = React.useRef(v4()).current;
  const order = React.useRef(items.map((_, index) => index));
  const y = React.useRef(items.map((_, index) => ({
    prevY: index * buttonHeight,
    curY: index * buttonHeight,
  }))).current;
  const springs = React.useRef(items.map((_, index) => {
    const [spring, set] = useSpring(() => ({
      transform: `translate3d(0px, 0px, 0px) scale(1)`,
      zIndex: index,
    }));
    return {
      spring,
      set,
      originalIndex: index,
    }
  })).current;

  const bind = useGesture({
    onDragStart: (state) => {
      const {args} = state;
      const [originalIndex] = args;
      y[originalIndex].prevY = y[originalIndex].curY;
    },
    onDrag: (state) => {
      const {args, xy, initial, down} = state;
      const [originalIndex] = args;
      const {prevY} = y[originalIndex];
      const diffY = xy[1] - initial[1];
      y[originalIndex].curY = prevY + diffY;
      const originalY = originalIndex * buttonHeight;
      const {curY} = y[originalIndex];
      const transformY = curY - originalY;
      const newIndex = clamp(0, items.length - 1, Math.round(curY / buttonHeight));
      order.current = update(order.current, originalIndex, newIndex);
      const {set} = springs[originalIndex];
      set({
        transform: `translate3d(0px, ${transformY}px, 0px) scale(1.2)`,
        zIndex: items.length,
      })
      springs.forEach(({set, originalIndex}) => {
        if (originalIndex === args[0]) return;
        const newIndex = order.current.indexOf(originalIndex);
        const transformY = (newIndex - originalIndex) * buttonHeight;
        set({
          transform: `translate3d(0px, ${transformY}px, 0px) scale(1)`,
          zIndex: newIndex,
        })
      })
    },
    onDragEnd: () => {
      springs.forEach(({set, originalIndex}) => {
        const newIndex = order.current.indexOf(originalIndex);
        y[originalIndex].prevY = y[originalIndex].curY;
        y[originalIndex].curY = newIndex * buttonHeight;
        const transformY = (newIndex - originalIndex) * buttonHeight;
        set({
          transform: `translate3d(0px, ${transformY}px, 0px) scale(1)`,
          zIndex: newIndex,
        })
      })
    }
  })

  return (
    <div className="content" style={{ height: items.length * 100 }}>
      {items.map((item, i) => {
        const {spring} = springs[i];
        return (
          <animated.div
            key={`${nodeId}-draggable-item-${i}`}
            {...bind(i)}
            style={{...spring, position: "relative", width: "fit-content", height: "fit-content"}}>
            <ItemContainer style={{backgroundColor: chroma.random().hex()}}>
              {item}
            </ItemContainer>
          </animated.div>
        )
      })}
    </div>
  )
}

export default LegacyDraggableList
