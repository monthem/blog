import React from 'react'
import { animated, useSpring } from 'react-spring';
import { CSSProperties } from 'styled-components';
type AnimatedRectProps = {
  active?: boolean;
  from?: CSSProperties;
  to?: CSSProperties;
  children?: JSX.Element;
}

const AnimatedRect: React.FC<AnimatedRectProps> = (props) => {
  const {from = {}, to = {}, active} = props;
  const animatedValue = useSpring(active ? {...from, ...to} : {...to, ...from})

  return (
    <animated.div style={animatedValue}>
      {props.children}
    </animated.div>
  )
}

export default AnimatedRect
