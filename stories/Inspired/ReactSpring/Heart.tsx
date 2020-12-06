import * as d3 from 'd3';
import React from 'react'
import { animated, SpringConfig, useSpring, useSprings, useTrail } from 'react-spring'
import { Trail } from 'react-spring/renderprops'
import styled, { css, CSSProperties } from 'styled-components'
import {v4 as uuidv4} from 'uuid';

const commonCss = css`
  box-sizing: border-box;
  position: absolute;
`;

const HeartBottom = styled(animated.div)`
  width: 100px;
  height: 120px;
  background-color: dodgerblue;
  border-radius: 50%;
  border-bottom: 20px solid blue;
  ${commonCss}
`;



const HeartLeft = styled(animated.div)`
  width: 100px;
  height: 150px;
  background-color: springgreen;
  border-radius: 50%;
  border-left: 10px solid mediumseagreen;
  border-right: 20px solid mediumseagreen;
  ${commonCss}
`;

const HeartRight = styled(animated.div)`
  width: 100px;
  height: 150px;
  background-color: orange;
  border-radius: 50%;
  border-right: 20px solid firebrick;
  border-left: 10px solid firebrick;
  border-bottom: 20px solid firebrick;
  ${commonCss}
`;

const HeartTop = styled(animated.div)`
  width: 140px;
  height: 140px;
  background-color: red;
  border-radius: 50%;
  border: 30px solid firebrick;
  z-index: -1;
  ${commonCss};
`;

type HeartPartDirection = "top" | "left" | "right" | "bottom";

const idxToPart = {
  0: "bottom",
  1: "left",
  2: "right",
  3: "top",
} as const;

const HeartParts: {[T in HeartPartDirection]: typeof HeartTop} = {
  top: HeartTop,
  left: HeartLeft,
  right: HeartRight,
  bottom: HeartBottom,
}

const HeartAnimationDefinition: {
  [T in HeartPartDirection]: {
    rest: CSSProperties["transform"],
    pump: CSSProperties["transform"],
  }
} = {
  top: {
    rest: "scale(1) rotateX(-30deg) rotateY(-5deg) translate3d(0px, -80px, 0px)",
    pump: "scale(0.9) rotateX(-10deg) rotateY(-15deg) translate3d(0px, -80px, 0px)"
  },
  left: {
    rest: "scale(1) rotateY(10deg) translate3d(-10px, 0px, 0px)",
    pump: "scale(1.1) rotateY(-10deg) translate3d(-10px, -20px, 0px)",
  },
  right: {
    rest: "scale(1) rotateY(10deg) translate3d(60px, -10px, 0px)",
    pump: "scale(1.1) rotateY(20deg) translate3d(60px, -20px, 0px)"
  },
  bottom: {
    rest: "scaleY(1) rotateY(0deg) translate3d(30px, 60px, 0px)",
    pump: "scaleY(0.95) rotateY(20deg) translate3d(30px, 55px, 0px)",
  }
}

const Flex = styled.div`
  display: flex;
`;

const fast: SpringConfig = {tension: 1200, friction: 60};
const slow: SpringConfig = {tension: 600, friction: 30};

const Heart = () => {
  const blurRef = React.useRef<SVGFEGaussianBlurElement>();
  const shouldBlur = React.useRef<boolean>(false);
  const [pumpCycle, setPumpCycle] = React.useState(0);

  const goToNextCycle = () => {
    setPumpCycle(pumpCycle === 0 ? 1 : 0)
  }

  const setBlurStrength = (stdDeviation: number) => {
    blurRef.current.setAttribute("stdDeviation", String(stdDeviation));
  }

  const removeBlur = () => {
    let start = -1;
    shouldBlur.current = false;
    const easing = d3.easeQuad;
    const duration = 200;
    const initialStdDeviation = Number(blurRef.current.getAttribute("stdDeviation"));
    
    const step = (timestamp: number) => {
      if (shouldBlur.current) return;
      if (start === -1) start = timestamp;
      const elapsed = timestamp - start;
      const progress = elapsed / duration;
      if (progress < 1) {
        setBlurStrength(initialStdDeviation * easing(1 - progress))
        requestAnimationFrame(step);
      } else {
        setBlurStrength(0);
      }
    }

    requestAnimationFrame(step);
  }

  const coverBlur = () => {
    let start = -1;
    shouldBlur.current = true;
    const duration = 200;
    const initialStdDeviation = Number(blurRef.current.getAttribute("stdDeviation"));
    const stdDeviationDiff = 20 - initialStdDeviation;
    const easing = d3.easeQuad;

    const step = (timestamp: number) => {
      if (!shouldBlur.current) return;
      if (start === -1) start = timestamp;
      const elapsed = timestamp - start;
      const progress = elapsed / duration;
      if (progress < 1) {
        setBlurStrength(initialStdDeviation + stdDeviationDiff * easing(progress))
        requestAnimationFrame(step);
      } else {
        setBlurStrength(20);
      }
    }

    requestAnimationFrame(step);
  }

  return (
    <>
    <svg style={{position: "absolute", width: 0, height: 0}}>
      <filter id="blobby">
        <feGaussianBlur ref={blurRef} x="-50%" y="-50%" width="200%" height="200%" stdDeviation="20" />
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 20 -8" />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0 1 1 1" />
        </feComponentTransfer>
      </filter>
    </svg>
    <Flex onMouseEnter={removeBlur} onMouseLeave={coverBlur} style={{alignItems: "center", width: 200, height: 200, filter: "url(#blobby)"}}>
      <Trail
        items={Array(4).fill("")}
        keys={() => uuidv4()}
        from={{pump: pumpCycle === 0 ? 1 : 0}}
        to={{pump: pumpCycle === 0 ? 0 : 1}}
        config={pumpCycle === 0 ? slow : fast}
        onRest={goToNextCycle}>
        {(item, i) => (props) => {
          const {pump} = props;
          const direction = idxToPart[i as 0 | 1 | 2 | 3];
          const Part = HeartParts[direction];
          const animation = HeartAnimationDefinition[direction];
          const transform = d3.interpolate(animation.rest, animation.pump)(pump);
          return <Part style={{transform}} />
        }}
      </Trail>
    </Flex>
    </>
  )
}

export default Heart
