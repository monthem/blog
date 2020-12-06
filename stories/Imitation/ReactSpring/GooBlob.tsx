import { xml } from 'd3';
import React from 'react'
import { animated, useTrail, SpringConfig } from 'react-spring';
import { Trail } from 'react-spring/renderprops';
import {v4 as uuidv4} from 'uuid';
import chroma from 'chroma-js';

type GooOption = {
  size: number;
  color: string;
}

type GooBlobProps = {
  goos: GooOption[];
}

//Difference: takes multiple goos, alpha channel is clamped for crisp edges. Used different colors
const fast: SpringConfig = { tension: 1200, friction: 40 };
const slow: SpringConfig = { mass: 10, tension: 200, friction: 50 };
const trans = (x, y) => `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;
const stdDeviation = 20;

const GooBlob: React.FC<GooBlobProps> = (props) => {
  const {goos} = props;
  const [trail, set] = useTrail(goos.length, () => ({
    xy: [0, 0],
    config: (i: number) => i === 0 ? fast : slow,
  }))

  const trackMouse = (e: MouseEvent) => {
    set({xy: [e.clientX, e.clientY]});
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", trackMouse);
    return () => {
      document.removeEventListener("mousemove", trackMouse)
    }
  })

  return (
    <>
    <svg style={{position: "absolute", left: 0, top: 0, width: 0, height: 0}}>
      <filter id="gooFilter">
        <feGaussianBlur x="-50%" y="-50%" width="200%" height="200%" stdDeviation={stdDeviation} />
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 20 -5" />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0 1 1 1" />
        </feComponentTransfer>
      </filter>
    </svg>
    <div style={{filter: "url(#gooFilter)"}}>
      {trail.map((props, i) => {
        const goo = goos[i];
        const {size, color} = goo;
        const lightSize = size / 3;
        return (
          <animated.div
            key={`goo${i}`}
            style={{
              position: "absolute",
              height: size,
              width: size,
              backgroundColor: color,
              borderRadius: size / 2,
              opacity: 0.8,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //@ts-ignore
              transform: props.xy.interpolate(trans),
              mixBlendMode: "hard-light",
              boxShadow: `0 0 0 10px ${chroma(color).darken().hex()}`
            }}
          >
            <div style={{
              height: lightSize,
              width: lightSize,
              borderRadius: lightSize / 2,
              backgroundColor: "white",
              marginRight: lightSize / 2,
              marginBottom: lightSize,
            }}/>
            <div style={{
              height: lightSize / 2,
              width: lightSize / 2,
              borderRadius: lightSize / 4,
              backgroundColor: "white",
              marginLeft: lightSize / 4,
              marginTop: lightSize,
            }}/>
          </animated.div>
        )
      })}
    </div>
    </>
  )
}

export default GooBlob
