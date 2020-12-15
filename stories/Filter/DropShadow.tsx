import React from 'react'
import styled, { CSSProperties } from 'styled-components';
import {FitContent, InvisibleSvg} from '../_Styled';
import chroma from 'chroma-js';
import {v4 as uuidv4} from 'uuid';

export type DropShadowProps = {
  children: React.ReactNode;
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
  fixedStep?: number;
  outlineColor?: CSSProperties["backgroundColor"];
  outlineWidth?: number;
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
    fixedStep,
    outlineColor,
    outlineWidth,
  } = props;

  const [r,g,b,a] = chroma(shadowColor).gl();
  const [or, og, ob, oa] = chroma(outlineColor).gl();
  const requiedOffestCount = mode === "discrete" 
    ? 1 
    : fixedStep || Math.max(Math.ceil(offset / interval), 0);
  const baseDistance = (mode === "discrete" || mode === "continuos" && fixedStep !== undefined) ? offset : interval;
  const dxConstant = baseDistance * Math.cos(angle * Math.PI / 180);
  const dyConstant = baseDistance * Math.sin(angle * Math.PI / 180);
  const nodeId = React.useRef(uuidv4()).current;
  const filterId = `${nodeId}-drop-shadow`;

  const feOffsets = Array(requiedOffestCount).fill(0).map((_, i) => {
    const multiplier = mode === "continuos" && fixedStep !== undefined ? (i + 1) / fixedStep : (i + 1);
    return (
    <feOffset
      key={`${nodeId}-offOut${i}`}
      result={`offOut${i}`}
      in="SourceAlpha"
      dx={dxConstant * multiplier}
      dy={dyConstant * multiplier}
    />
  )});

  const feMergeNodesForOffset = Array(requiedOffestCount).fill(0).map((_, i) => (
    <feMergeNode key={`${nodeId}-offOut${i}`} in={`offOut${i}`} />
  ))

  const blur = mode === "discrete" 
    ? blurRadius > 0 
      ? <feGaussianBlur stdDeviation={blurRadius} /> 
      : <></>
    : <></>;

  return (
    <>
    <InvisibleSvg>
      <filter x="-50%" y="-50%" width="200%" height="200%" id={filterId}>
        {feOffsets}
        <feMerge result="offOut">
          {feMergeNodesForOffset}
        </feMerge>
        {/* To support gradient, I can apply feColorMatrix to each offset by collecting appropriate color by using chroma */}
        <feColorMatrix result="colored-shadow" in="offOut" type="matrix"
          values={`
            1 0 0 0 ${r}
            0 1 0 0 ${g}
            0 0 1 0 ${b}
            0 0 0 ${a} 0
          `}
        />
        <feMorphology result="morph" in="offOut" radius={outlineWidth} operator="erode" />
        <feComposite result="outline" in="offOut" in2="morph" operator="out" />
        <feColorMatrix result="colored-outline" in="outline" type="matrix" values={`
          1 0 0 0 ${or}
          0 1 0 0 ${og}
          0 0 1 0 ${ob}
          0 0 0 ${oa} 0
        `} />
        {blur}
        <feComposite result="shadow" in="colored-outline" in2="colored-shadow" operator="over" />
        <feBlend in="SourceGraphic" in2="shadow" mode="normal" />
      </filter>
    </InvisibleSvg>
    <FitContent style={{filter: `url(#${filterId})`}}>
      {children}
    </FitContent>
    </>
  )
}

DropShadow.defaultProps = {
  shadowColor: "blue",
  blurRadius: 0,
  mode: "continuos",
  interval: 2,
  offset: 10,
  angle: 45,
  outlineColor: "black",
  outlineWidth: 1,
}

export default DropShadow
