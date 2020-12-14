import { animate } from 'popmotion';
import React from 'react'
import { animated, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import styled, { CSSProperties } from 'styled-components';
import DropShadow from '../../Filter/DropShadow';
import { FitContent } from '../../_Styled';

type ShadowHoverResponderProps = {
  style?: CSSProperties;
  shadowColor?: CSSProperties["backgroundColor"];
  offsetOnHover?: number;
  offsetOnIdle?: number;
  outlineColor?: CSSProperties["backgroundColor"];
  outlineWidth?: number;
  shadowAngle?: number;
  children: React.ReactNode;
  shadowInterval?: number;
}

const ShadowHoverResponder: React.FC<ShadowHoverResponderProps> = (props) => {
  const {
    children,
    style,
    shadowColor,
    offsetOnHover,
    offsetOnIdle,
    shadowAngle,
    shadowInterval,
    outlineColor,
    outlineWidth,
  } = props;
  const [offset, setOffset] = React.useState(offsetOnIdle);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const popmotionRef = React.useRef<{animation: {stop: () => void}; finished: boolean}>({animation: null, finished: false});

  const bind = useGesture({
    onHover: (state) => {
      const {hovering} = state;
      popmotionRef.current.animation = animate({
        from: offset,
        to: hovering ? offsetOnHover : offsetOnIdle,
        duration: hovering ? 200 : 200,
        type: "keyframes",
        onUpdate: (val) => {
          const dx = Math.cos(shadowAngle * Math.PI / 180) * (val - offsetOnIdle);
          const dy = Math.sin(shadowAngle * Math.PI / 180) * (val - offsetOnIdle);
          setOffset(val);
          containerRef.current.style.setProperty("transform", `translateX(${-dx}px) translateY(${-dy}px)`)
        },
        onPlay: () => popmotionRef.current.animation?.stop(),
        onComplete: () => popmotionRef.current.finished = true,
      })
    },
  });

  return (
    <FitContent {...bind()}>
      <DropShadow
        offset={offset}
        interval={shadowInterval}
        angle={shadowAngle}
        outlineColor={outlineColor}
        outlineWidth={outlineWidth}
        shadowColor={shadowColor}>
        <FitContent ref={containerRef} style={style}>
          {children}
        </FitContent>
      </DropShadow>
    </FitContent>
  )
}

ShadowHoverResponder.defaultProps = {
  offsetOnHover: 10,
  offsetOnIdle: 3,
  shadowColor: "dodgerblue",
  shadowAngle: 45,
  shadowInterval: 1,
  outlineWidth: 1,
  outlineColor: "black",
}

export default ShadowHoverResponder
