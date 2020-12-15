import React from 'react'
import { animated, useSpring } from 'react-spring';
import { CSSProperties } from 'styled-components';
import { v4 } from 'uuid';
import { FitContent, InvisibleSvg } from '../../_Styled';

type CircleRevealerProps = {
  children: React.ReactNode;
  visible?: boolean;
}

const CircleRevealer: React.FC<CircleRevealerProps> = (props) => {
  const {
    children,
    visible,
  } = props;
  const nodeId = React.useRef(v4()).current;
  const clipPathId = `${nodeId}-circle-revelaer-clip-path`;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [circleSpring, setCircleSpring] = useSpring(() => ({
    cx: 0,
    cy: 0,
    r: 0,
  }))

  React.useEffect(() => {
    const rect = containerRef.current.getBoundingClientRect();
    const {width, height} = rect;
    const diagonalLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    setCircleSpring({
      cx: width / 2,
      cy: height / 2,
      immediate: true,
    })
    
    setCircleSpring({
      r: visible ? diagonalLength / 2 : 0,
      immediate: false,
    })
  })

  return (
    <>
    <InvisibleSvg>
      <defs>
        <clipPath id={clipPathId}>
          <animated.circle {...circleSpring} />
        </clipPath>
      </defs>
    </InvisibleSvg>
    <FitContent ref={containerRef} style={{clipPath: `url(#${clipPathId})`}}>
      {children}
    </FitContent>
    </>
  )
}

export default CircleRevealer
