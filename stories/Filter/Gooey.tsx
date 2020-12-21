import * as d3 from 'd3';
import React from 'react'
import { animated, OpaqueInterpolation, useSpring } from 'react-spring';
import { useDrag, useGesture } from 'react-use-gesture';
import { CSSProperties } from 'styled-components';
import { v4 } from 'uuid';
import { getCenterPos } from '../../utils/htmlElement';
import { getDistance } from '../../utils/number';
import { FitContent, InvisibleSvg } from '../_Styled';

export type GooeyProps = {
  blurRadius?: number;
  gooSize?: number;
  gooColor?: CSSProperties["backgroundColor"];
}

const exponentForHorizontal = 1;
const exponentForVertical = 1;

const Gooey: React.FC<GooeyProps> = (props) => {
  const {
    children,
    blurRadius = 10,
    gooSize = 30,
    gooColor = "blue",
  } = props;
  const nodeId = React.useRef(v4()).current;
  const filterId = `${nodeId}-gooey`;
  const [{xy, center, cxcy}, setSpring] = useSpring(() => ({
    xy: [gooSize / 2, gooSize / 2],
    center: [gooSize / 2, gooSize / 2],
    cxcy: [gooSize / 2, gooSize / 2],
  }))
  const container = React.useRef<HTMLDivElement>(null);
  const gooOffsetLimit = gooSize / 4;
  useDrag((state) => {
    if (!container.current) return;
    const {xy, dragging, down} = state;
    const {left, top, bottom, right, height, width} = container.current.getBoundingClientRect();
    const [x, y] = xy;
    const side = {
      x: {
        min: left,
        max: right,
        center: left + width / 2,
        length: width,
        referingPoint: x,
        exponent: exponentForHorizontal,
      },
      y: {
        min: top,
        max: bottom,
        center: top + height / 2,
        length: height,
        referingPoint: y,
        exponent: exponentForVertical,
      }
    }
    const referingSide = (x < left || x > right) ? "vertical" : "horizontal";
    const targetSide = referingSide === "vertical" ? side.y : side.x;
    const {referingPoint, length, exponent} = targetSide;
    const relativeDistanceToCenter = Math.min(Math.abs(referingPoint - targetSide.center) / (length / 2), 1);
    const relativeDistanceToEdgeFromCenter = 1 - relativeDistanceToCenter;
    const interpolate = d3.interpolate(1, 50);
    const logBase = interpolate(relativeDistanceToEdgeFromCenter);
    const logResult = Math.log10(Math.pow(logBase, exponent));
    if (dragging) {
      const offsetFromCenter = {
        x: x - (left + width / 2),
        y: y - (top + height / 2),
      }
      const relativeOffsetFromCenter = {
        x: Math.max(Math.min(offsetFromCenter.x / (width / 2), logResult), -logResult),
        y: Math.max(Math.min(offsetFromCenter.y / (height / 2), logResult), -logResult),
      }
      setSpring({
        xy: [relativeOffsetFromCenter.x * (gooOffsetLimit), relativeOffsetFromCenter.y * (gooOffsetLimit)],
        cxcy: [
          Math.min(Math.max(x, left + gooSize / 2), right - gooSize / 2) - left,
          Math.min(Math.max(y, top + gooSize / 2), bottom - gooSize / 2) - top,
        ],
      });
    } else {
      setSpring({
        xy: [0, 0],
        cxcy: center.getValue(),
      });
    }
  }, {
    domTarget: container,
  })

  React.useEffect(() => {
    if (container.current) {
      const center = getCenterPos(container.current);
      setSpring({
        xy: [0, 0],
        center: [center.x, center.y],
        cxcy: [center.x, center.y]
      })
    }
  })

  return (
    <>
    <InvisibleSvg>
      <clipPath id={`${nodeId}-clipPath`}>
        <animated.circle
          //@ts-ignore
          cx={cxcy.interpolate((x) => x)}
          //@ts-ignore
          cy={cxcy.interpolate((x,y) => y)}
          r={gooSize / 2}
        />
      </clipPath>
      <filter x="-50%" y="-50%" width="200%" height="200%" id={filterId}>
        <feGaussianBlur result="blurred" stdDeviation={blurRadius} />
        <feColorMatrix result="alpha-increased" in="blurred" values="
          1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 1 0
        " />
        <feComponentTransfer result="goo" in="alpha-increased">
          <feFuncA type="discrete" tableValues="0 1 1 1" />
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </InvisibleSvg>
    <FitContent
      ref={container}
      style={{filter: `url(#${filterId})`}}>
      {children}
      <animated.div
        style={{
          position: "absolute",
          width: gooSize,
          height: gooSize,
          borderRadius: gooSize / 2,
          backgroundColor: gooColor,
          top: 0, left: 0,
          //@ts-ignore
          transform: xy.interpolate((x, y) => `translate(${x}px, ${y}px)`),
          userSelect: "none",
          zIndex: -1,
          clipPath: `url(#${nodeId}-clipPath)`
        }}
      >
        {children}
      </animated.div>
    </FitContent>
    </>
  )
}

Gooey.defaultProps = {
  blurRadius: 5,
  gooSize: 30,
  gooColor: "red"
}

export default Gooey
