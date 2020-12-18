import React from 'react';
import _ from 'lodash';
import { animated, useSprings, useTransition } from 'react-spring';
import utils from './utils'

const {getMasonryGridGuide} = utils;

export type MasonryGridProps<T> = {
  items: T[];
  /**@property {function} keyExtractor this should return static key which is inherent in the item */
  keyExtractor: (item: T) => string;
  render: (item: T, i: number) => JSX.Element;
  lengthExtractor: (item: T, i: number) => number;
  columnCount?: number;
  margin?: number;
  width?: number;
  shuffleEvery?: number;
}

const MasonryGrid: (<T>(props: MasonryGridProps<T>) => JSX.Element) = (props) => {
  const {
    // items,
    render,
    keyExtractor,
    lengthExtractor,
    margin = 15,
    width = 600,
    shuffleEvery,
  } = props;
  const [items, setItems] = React.useState(props.items);
  const columnCount = Math.max(props.columnCount || 2, 1);
  const availableWidth = width - columnCount * margin;
  const gridItemWidth = availableWidth / columnCount;
  const variableLength = React.useRef<number[]>(items.map((item, i) => lengthExtractor(item, i)));
  const transformGuide = getMasonryGridGuide({
    direction: "vertical",
    column: columnCount,
    variableLength: variableLength.current,
    gridItemWidth,
    margin,
  });

  const mapped = items.map((item, i) => ({data: item, transform: transformGuide[i]}));
  const update = (opacity: number) => (item: typeof mapped[number]) => {
    const [x, y] = item.transform;
    return {
      opacity,
      transform: `translate(${x}px, ${y}px)`,
      width: gridItemWidth,
    }
  };

  const transitions = useTransition(mapped, (mappedItem) => keyExtractor(mappedItem.data), {
    from: update(0),
    enter: update(1),
    update: update(1),
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25
  });

  React.useEffect(() => {
    const interval = shuffleEvery !== undefined ? setInterval(() => {
      const shuffled = _.shuffle(items);
      variableLength.current = shuffled.map((item, i) => lengthExtractor(item, i));
      setItems(shuffled)
    }, Math.max(shuffleEvery, 1000)) : undefined
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [shuffleEvery])

  return (
    <div style={{width}}>
      {transitions.map((transition, i) => {
        const item = transition.item.data;
        const props = transition.props;
        return (
          <animated.div
            key={keyExtractor(item)}
            style={{
              position: "absolute",
              height: "fit-content",
              overflow: "hidden",
              ...props,
            }}>
            {render(item, i)}
          </animated.div>
        )
      })}
    </div>
  )
}

export default MasonryGrid
