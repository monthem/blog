import React from 'react'
import { animated, useSpring } from 'react-spring'
import * as d3 from 'd3';
import { CSSProperties } from 'styled-components';

const origin = {
  transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale(0.8)",
  boxShadow: "0px 0px 30px 0px rgba(0, 0, 0, 0.5)",
  border: "10px solid white",
}

export type Card3dProps = {
  src?: HTMLImageElement["src"];
}

const Card3d: React.FC<Card3dProps> = (props) => {
  const {src} = props; 
  const [cardStyle, set] = useSpring(() => origin)
  
  const imgRef = React.useRef<HTMLImageElement>(null);

  const trackMouse = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const {left, top, width, height} = imgRef.current?.getBoundingClientRect() || {left: 0, top: 0, width: 0, height: 0};
    const {clientX, clientY} = e;
    const relativeX = (clientX - left) / width;
    const relativeY = (clientY - top) / height;
    const rotateX = d3.interpolate(25, -25)(relativeY);
    const rotateY = d3.interpolate(-25, 25)(relativeX);
    const transform: CSSProperties["transform"] = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.9)`;
    set({
      transform,
      boxShadow: "0px 0px 50px 10px rgba(0, 0, 0, 0.5)",
    })
  }

  const reset = () => {
    set(origin);
  }

  return (
    <>
    <div>
      <animated.img
        src={src}
        ref={imgRef}
        onMouseMove={trackMouse}
        onMouseLeave={reset}
        style={{
          ...cardStyle,
          borderRadius: 20,
        }}
      />
    </div>
    </>
  )
}

export default Card3d
