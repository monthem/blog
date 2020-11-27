import React from 'react'
import { animated, useSpring } from 'react-spring';
import styled, { CSSProperties } from 'styled-components';
import AnimatedRect from '../AnimatedRect/AnimatedRect';

export type UnderlinedButtonBaseProps = {
  active?: boolean;
  direction?: "vertical" | "horizontal";
  color?: CSSProperties["color"];
  activeColor?: CSSProperties["color"];
  underlineColor?: CSSProperties["color"];
  underlineHeight?: number;
  style?: CSSProperties;
}

export type UnderlinedButtonProps = UnderlinedButtonBaseProps & {
  alternate?: boolean;
}

const UnderlinedButtonBase: React.FC<UnderlinedButtonBaseProps> = (props) => {
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

const UnderlinedButton: React.FC<UnderlinedButtonProps> = (props) => {
  const {
    active,
    color,
    activeColor,
    alternate,
    direction: initialDirection,
    style,
    underlineColor,
    underlineHeight,
  } = props;

  const [direction, setDirection] = React.useState(initialDirection);

  React.useEffect(() => {
    if (!active && alternate) {
      if (direction === "horizontal") {
        setDirection("vertical");
      } else {
        setDirection("horizontal");
      }
    }
  }, [active])

  return <UnderlinedButtonBase
    active={active}
    color={color}
    activeColor={activeColor}
    direction={direction}
    style={style}
    underlineColor={underlineColor}
    underlineHeight={underlineHeight}
  />
}

export default UnderlinedButton
