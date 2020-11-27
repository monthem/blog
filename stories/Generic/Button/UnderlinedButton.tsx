import React from 'react'
import { animated, useSpring } from 'react-spring';
import styled, { CSSProperties } from 'styled-components';
import AnimatedRect from '../AnimatedRect/AnimatedRect';

export type UnderlinedButtonProps = {
  active?: boolean;
  direction?: "vertical" | "horizontal";
  color?: CSSProperties["color"];
  activeColor?: CSSProperties["color"];
  underlineColor?: CSSProperties["color"];
  underlineHeight?: number;
  style?: CSSProperties;
}

const UnderlinedButton: React.FC<UnderlinedButtonProps> = (props) => {
  const {
    children,
    active,
    style,
    color = "black",
    underlineColor = "dodgerblue",
    direction,
    underlineHeight = 5,
  } = props;

  const {
    activeColor = underlineColor,
  } = props;

  const buttonStyle = useSpring({
    outline: "none",
    border: "none",
    backgroundColor: "transparent",
    color: active ? activeColor : color,
    fontWeight: active ? "bolder" : "normal",
    cursor: "pointer",
    ...style,
  })

  const rectSizeTargetProp = direction === "horizontal" ? "width" : "height";
  const rectSizeStaticProp = direction === "horizontal" ? "height" : "width";

  return (
    <div>
      <div style={{display: "flex"}}>
        <div>
          <animated.button style={buttonStyle}>
            {children || "BUTTON"}
          </animated.button>
          <AnimatedRect
            from={{
              [rectSizeStaticProp]: rectSizeStaticProp === "height" ? underlineHeight : "100%",
              [rectSizeTargetProp]: rectSizeTargetProp === "height" ? 0 : "0%",
              opacity: 0,
              backgroundColor: underlineColor,
            }}
            to={{
              [rectSizeTargetProp]: rectSizeTargetProp === "height" ? underlineHeight : "100%",
              opacity: 1,
            }}
            active={active}
          />
        </div>
      </div>
    </div>
  )
}

export default UnderlinedButton
