import React from 'react'
import styled, { CSSProperties } from 'styled-components';
import InvisibleSvg from '../_Styled/InvisibleSvg';
import chroma from 'chroma-js';

const normalizeColor = (rgba: [number, number, number, number]) => {
  const [r, g, b, a] = rgba;
  const max = Math.max(r, g, b) || 1;
  return [r/max, g/max, b/max, a];
}

const Container = styled.div`
  width: fit-content;
  height: fit-content;
  filter: url(#drop-shadow);
`;

type DropShadowProps = {
  children: JSX.Element;
  shadowColor?: CSSProperties["backgroundColor"];
  /**@param blurRadius works on discrete mode */
  blurRadius?: number;
  /**@param mode discrete mode is typical drop-shadow, continuos mode draws illustrator-style shadow */
  mode?: "discrete" | "continuos";
  offset?: number;
  /**@param interval works on continuos mode only. This defines distance between shadow */
  interval?: number;
  /**@param angle defines shadow offset angle in degree */
  angle?: number;
}

const DropShadow: React.FC<DropShadowProps> = (props) => {
  const {
    children,
    shadowColor,
    blurRadius,
    mode,
    offset,
    interval,
    angle,
  } = props;

  const [r,g,b,a] = normalizeColor(chroma(shadowColor).rgba());
  const requiedOffestCount = mode === "discrete" ? 1 : Math.ceil(offset / interval);
  const baseDistance = mode === "discrete" ? offset : interval;
  const dxConstant = baseDistance * Math.cos(angle * Math.PI / 180);
  const dyConstant = baseDistance * Math.sin(angle * Math.PI / 180);

  const feOffsets = Array(requiedOffestCount).fill(0).map((_, i) => (
    <feOffset
      key={`offOut${i}`}
      result={`offOut${i}`}
      in="SourceAlpha"
      dx={dxConstant * (i + 1)}
      dy={dyConstant * (i + 1)}
    />
  ));

  const feMergeNodesForOffset = Array(requiedOffestCount).fill(0).map((_, i) => (
    <feMergeNode key={`offOut${i}`} in={`offOut${i}`} />
  ))

  const blur = mode === "discrete" ? <feGaussianBlur stdDeviation={blurRadius} /> : <></>;

  return (
    <>
    <InvisibleSvg>
      <filter x={-offset/2} y={-offset/2} width={offset} height={offset} id="drop-shadow">
        {feOffsets}
        <feMerge result="offOut">
          {feMergeNodesForOffset}
        </feMerge>
        {/* To support gradient, I can apply feColorMatrix to each offset by collecting appropriate color by using chroma */}
        <feColorMatrix result="colored" in="offOut" type="matrix"
          values={`
            1 0 0 0 ${r}
            0 1 0 0 ${g}
            0 0 1 0 ${b}
            0 0 0 ${a} 0
          `}
        />
        {blur}
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>
    </InvisibleSvg>
    <Container>
      {children}
    </Container>
    </>
  )
}

DropShadow.defaultProps = {
  shadowColor: "blue",
  blurRadius: 0,
  mode: "continuos",
  interval: 0.5,
  offset: 10,
  angle: 45,
}

export default DropShadow
