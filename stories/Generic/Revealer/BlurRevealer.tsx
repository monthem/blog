import React from 'react'
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';

type BlurRevealerProps = {
  children: JSX.Element;
  visible?: boolean;
  blurRadius?: number;
}

const BlurRevealer: React.FC<BlurRevealerProps> = (props) => {
  const {children, visible, blurRadius} = props;
  const spring = useSpring({
    filter: visible ? "blur(0px)" : `blur(${blurRadius}px)`,
    opacity: visible ? 1 : 0,
  })
  return (
    <animated.div style={spring}>
      {children}
    </animated.div>
  )
}

BlurRevealer.defaultProps = {
  blurRadius: 5,
}

export default BlurRevealer
