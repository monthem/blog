import * as d3 from 'd3';
import React from 'react'
import { animated, SpringConfig, useSpring, useSprings, useTrail } from 'react-spring'
import { Trail } from 'react-spring/renderprops'
import styled, { css, CSSProperties } from 'styled-components'
import {v4 as uuidv4} from 'uuid';
import _styled from './_styled';
import _util from './_util';
import {animate} from 'popmotion';

const {HeartAnimationDefinition, HeartParts, idxToPart} = _util;
const fast: SpringConfig = {tension: 1200, friction: 60, velocity: 100};
const slow: SpringConfig = {tension: 600, friction: 30, velocity: 10};

type HeartProps = {
  showBareOnTouch?: boolean;
}

const Heart: React.FC<HeartProps> = (props) => {
  const {showBareOnTouch} = props;
  const blurRef = React.useRef<SVGFEGaussianBlurElement>();
  const shouldBlur = React.useRef<boolean>(false);
  const [pumpCycle, setPumpCycle] = React.useState(0);

  const goToNextCycle = () => {
    setPumpCycle(pumpCycle === 0 ? 1 : 0)
  }

  const setBlurStrength = (stdDeviation: number) => {
    blurRef.current.setAttribute("stdDeviation", String(stdDeviation));
  }

  const removeBlur = () => {
    if (!showBareOnTouch) return;
    const animation = animate({
      from: Number(blurRef.current.getAttribute("stdDeviation")),
      to: 0,
      onPlay: () => shouldBlur.current = false,
      onUpdate: (v) => {
        setBlurStrength(v);
        if (shouldBlur.current) animation.stop();
      },
    })
  }

  const coverBlur = () => {
    if (!showBareOnTouch) return;
    const animation = animate({
      from: Number(blurRef.current.getAttribute("stdDeviation")),
      to: 20,
      onPlay: () => shouldBlur.current = true,
      onUpdate: (v) => {
        setBlurStrength(v);
        if (!shouldBlur.current) animation.stop();
      }
    })
  }

  return (
    <>
    <svg style={{position: "absolute", width: 0, height: 0}}>
      <filter id="blobby">
        <feGaussianBlur ref={blurRef} x="-50%" y="-50%" width="200%" height="200%" stdDeviation="20" />
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 20 -8" />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0 1 1 1" />
        </feComponentTransfer>
      </filter>
    </svg>
    <div
      onMouseEnter={removeBlur}
      onMouseLeave={coverBlur}
      style={{
        width: 240,
        height: 300,
        filter: "url(#blobby)",
      }}>
      <div style={{marginLeft: "18%", marginTop: "35%"}}>
      <Trail
        items={Array(4).fill("")}
        keys={() => uuidv4()}
        from={{pump: pumpCycle === 0 ? 1 : 0}}
        to={{pump: pumpCycle === 0 ? 0 : 1}}
        config={pumpCycle === 0 ? slow : fast}
        onRest={goToNextCycle}>
        {(item, i) => (props) => {
          const {pump} = props;
          const direction = idxToPart[i as 0 | 1 | 2 | 3];
          const Part = HeartParts[direction];
          const animation = HeartAnimationDefinition[direction];
          const transform = d3.interpolate(animation.rest, animation.pump)(pump);
          return <Part style={{transform}} />
        }}
      </Trail>
      </div>
    </div>
    </>
  )
}

export default Heart
