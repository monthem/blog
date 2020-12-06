import * as d3 from 'd3';
import React from 'react'
import { animated, SpringConfig, useSpring, useSprings, useTrail } from 'react-spring'
import styled from 'styled-components'

const HeartTop = styled(animated.div)`
  width: 100px;
  height: 80px;
  background-color: red;
  border-radius: 50%;
  border: 30px solid firebrick;
`;

const HeartBottom = styled(animated.div)`
  width: 100px;
  height: 100px;
  background-color: dodgerblue;
  border-radius: 50%;
  border-bottom: 20px solid blue;
`;

const HeartLeft = styled(animated.div)`
  width: 70px;
  height: 150px;
  background-color: springgreen;
  border-radius: 50%;
  border-left: 10px solid mediumseagreen;
  border-right: 20px solid mediumseagreen;
`;

const HeartRight = styled(animated.div)`
  width: 70px;
  height: 130px;
  background-color: orange;
  border-radius: 50%;
  border-right: 20px solid firebrick;
  border-left: 10px solid firebrick;
  border-bottom: 20px solid firebrick;
`;

const Flex = styled.div`
  display: flex;
`;

const fast = {tension: 2000, friction: 60};
const slow = {tension: 600, friction: 30};

const Heart = () => {
  const [pumpTrail, setPumpTrail] = useTrail(4, () => ({
    pump: 0,
  }));
  const [bottom, left, right, top] = pumpTrail;

  React.useEffect(() => {
    setPumpTrail({
      pump: 1,
      config: fast,
      onRest: () => {
        if (pumpTrail[0].pump.getValue() === 0) {
          setPumpTrail({pump: 1, config: fast});
        } else {
          setPumpTrail({pump: 0, config: slow});
        }
      },
    })
  })

  return (
    <>
    <svg style={{position: "absolute", width: 0, height: 0}}>
      <filter id="blobby">
        <feGaussianBlur x="-50%" y="-50%" width="200%" height="200%" stdDeviation="20" />
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 20 -8" />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0 1 1 1" />
        </feComponentTransfer>
      </filter>
    </svg>
    <animated.div style={{width: "fit-content", filter: "url(#blobby)", cursor: "pointer"}}>
      <Flex style={{justifyContent: "center"}}>
        <HeartTop style={{transform: top.pump.interpolate({
            range: [0, 1],
            output: [
              "scale(1) rotate(0deg) translate3d(0px, 100px, 0px)",
              "scale(0.9) rotate(30deg) translate3d(60px, 100px, 0px)"
            ]
          })
        }}>
        </HeartTop>
      </Flex>
      <Flex style={{flexDirection: "row"}}>
        <HeartLeft style={{transform: left.pump.interpolate({
            range: [0, 1],
            output: [
              "rotate(-20deg) translate3d(0px, 40px, 0px)",
              "rotate(-30deg) translate3d(0px, 20px, 0px)"
            ]
          })
        }}/>
        <HeartRight style={{transform: right.pump.interpolate({
            range: [0, 1],
            output: [
              "rotate(10deg) translate3d(0px, 20px, 0px)",
              "rotate(10deg) translate3d(0px, 10px, 0px)"
            ]
          })
        }}/>
      </Flex>
      <Flex style={{justifyContent: "center"}}>
        <HeartBottom style={{transform: bottom.pump.interpolate({
            range: [0, 1],
            output: [
              "scaleY(1) rotate(-20deg) translate3d(20px, -50px, 0px)",
              "scaleY(0.95) rotate(10deg) translate3d(-10px, -70px, 0px)",
            ]
          })
        }}/>
      </Flex>
    </animated.div>
    </>
  )
}

export default Heart
