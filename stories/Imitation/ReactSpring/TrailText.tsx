import React from 'react'
import { animated, useTrail, SpringConfig } from 'react-spring';
import styled, { CSSProperties } from 'styled-components';
import chroma from 'chroma-js';

const StyledAnimatedText = styled(animated.div)`
  font-size: 40px;
  font-weight: bolder;
  overflow: hidden;
  height: 60px;
  user-select: none;
`

type TrailTextProps = {
  texts?: string[];
  direction?: CSSProperties["flexDirection"];
}

const fast: SpringConfig = {
  tension: 600,
  friction: 60,
}

const slow: SpringConfig = {
  mass: 5,
  tension: 600,
  friction: 60,
}

//Difference: Used clipPath for masking element.
const TrailText: React.FC<TrailTextProps> = (props) => {
  const {texts = ["Lorem", "Ipsum", "Dolor", "Sit"], direction} = props;
  const colors = ["#88a631", "#47baf4", "#4b9585", "#e9992e"];
  const [reveal, setReveal] = React.useState(true);
  const responsiveStyle: CSSProperties = direction === "row"
    ? {
      clipPath: reveal ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 0 0, 0 100%, 0 100%)",
      opacity: reveal ? 1 : 0,
      transform: reveal ? "translate3d(0px, 0px, 0px)" : "translate3d(50px, 0px, 0px)",
    }
    : {
      clipPath: reveal ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 100% 0, 100% 0, 0 0)",
      opacity: reveal ? 1 : 0,
      transform: reveal ? "translate3d(0px, 0px, 0px)" : "translate3d(0px, 20px, 0px)",
    }
  const [trail, set] = useTrail(texts.length, () => ({
    ...responsiveStyle,
    config: (i) => Number(i) === 0 ? slow : fast,
  }));
  set(responsiveStyle)
  return (
    <>
    <div style={{display: "flex", flexDirection: direction, cursor: "pointer"}} onClick={() => setReveal(!reveal)}>
      {trail.map((props, i) => (
        <StyledAnimatedText
          key={i}
          style={{
            ...props,
            marginRight: direction === "row" && i < texts.length - 1 ? 10 : 0,
            color: colors[i],
          }}>
          {texts[i]}
        </StyledAnimatedText>
      ))}
    </div>
    </>
  )
}

TrailText.defaultProps = {
  texts: ["Lorem", "Ipsum", "Dolor", "Sit"],
  direction: "row",
}

export default TrailText
