import chroma from 'chroma-js';
import { animate } from 'popmotion';
import React from 'react'
import { AnimatedValue, OpaqueInterpolation } from 'react-spring';
import { CSSProperties } from 'styled-components';
import { v4 } from 'uuid';
import { isAllTrue, isAny } from '../../utils/condition';
import { getNewPos } from '../../utils/number';
import { FitContent, InvisibleSvg } from '../_Styled';
import Glow from './Glow';

type PathOption = {
  r?: number;
  width?: number;
  height?: number;
}

export const getCopperEdgePath = (option: PathOption) => {
  const {width = 300, height = 100, r = 10} = option;
  return `
  M ${r},0
  A ${r},${r} 0 0 1 0,${r}
    ${r},${r} 0 0 1 0,${r}
  v ${height - r * 2}
  a ${r},${r} 0 0 1 ${r},${r}
  h ${width - r * 2}
  a ${r},${r} 0 0 1 ${3.5 * r / 10},-${7.5 * r / 10}
    ${r},${r} 0 0 1 ${6.5 * r / 10},-${2.5 * r / 10}
  V ${r}
  A ${r},${r} 0 0 1 ${width - r},0
    ${r},${r} 0 0 1 ${width - r},0
  Z
  `
}

export type CopperEdgeProps = {
  edgeColor?: CSSProperties["backgroundColor"];
  lightColor?: CSSProperties["backgroundColor"];
  visible?: boolean;
  edgeWidth?: number;
  edgeRadius?: number;
  animated?: boolean;
  lightAngle?: number;
}

const CopperEdge: React.FC<CopperEdgeProps> = (props) => {
  const {
    children,
    edgeColor,
    edgeWidth = 5,
    visible,
    lightAngle = 45,
    lightColor,
  } = props;
  const edgeRadius = Math.max(props.edgeRadius || 5, 0);
  const nodeId = React.useRef(v4()).current;
  const filterId = `${nodeId}-copper-edge`;
  const clipPathId = `${nodeId}-coppet-edge-clip-path`;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [rect, setRect] = React.useState<Pick<DOMRect, "width" | "height">>({width: 0, height: 0});
  const mainErodeRef = React.useRef<SVGFEMorphologyElement>(null);
  const innerErodeRef = React.useRef<SVGFEMorphologyElement>(null);
  const outerErodeRef = React.useRef<SVGFEMorphologyElement>(null);
  const clipPathRef = React.useRef<SVGPathElement>(null);
  const edgeAnimationProgress = React.useRef(0);
  const width = Number(rect?.width) || 0;
  const height = Number(rect?.height) || 0;

  const mainLightPosition = getNewPos({
    angle: lightAngle,
    origin: {x: width / 2, y: height / 2},
    distance: Math.min(width, height),
  })

  const subLightPosition = getNewPos({
    angle: lightAngle + 180,
    origin: {x: width / 2, y: height / 2},
    distance: Math.min(width, height),
  })

  React.useEffect(() => {
    const capturedRect = containerRef.current?.getBoundingClientRect();
    const haveToUpdateRect = isAny([
      capturedRect?.width !== rect.width && capturedRect?.height !== rect.height,
      !rect,
    ])

    if (containerRef.current && haveToUpdateRect) {
      const rect = containerRef.current?.getBoundingClientRect();
      setRect(rect);
    }

    const animation = rect !== undefined ? animate({
      from: edgeAnimationProgress.current,
      to: visible ? 1 : 0,
      duration: props.animated ? undefined : 0,
      onUpdate: (progress) => {
        edgeAnimationProgress.current = progress;
        mainErodeRef.current?.setAttribute("radius", String(edgeWidth * progress));
        innerErodeRef.current?.setAttribute("radius", String((edgeWidth - 1) * progress));
        outerErodeRef.current?.setAttribute("radius", String(1 * progress));
        clipPathRef.current?.setAttribute("d", getCopperEdgePath({
          width: rect?.width,
          height: rect?.height,
          r: edgeRadius * progress,
        }));
      },
    }) : null;

    return () => {
      if (animation !== null) animation.stop();
    }
  })

  return (
    <>
    <InvisibleSvg>
      <clipPath id={clipPathId}>
        <path ref={clipPathRef} id="copper-edge" fill="red" stroke="black" d={getCopperEdgePath({r: edgeRadius, width: rect?.width, height: rect?.height})} />
      </clipPath>
      <filter id={filterId}>
        <feFlood result="edge-color" floodColor={edgeColor} />
        <feOffset result="copy" in="SourceAlpha" dx="0" dy="0" />
        <feMorphology ref={mainErodeRef} result="thick-eroded" in="copy" operator="erode" radius={edgeWidth} />
        <feComposite result="clipped-thick-eroded" in="copy" in2="thick-eroded" operator="out" />
        <feComposite result="colored-clipped-thick-eroded" in="edge-color" in2="clipped-thick-eroded" operator="in" />

        <feMorphology ref={innerErodeRef} result="inner-thin-eroded" in="copy" operator="erode" radius={edgeWidth - 1} />
        <feComposite result="clipped-inner-thin-eroded" in="inner-thin-eroded" in2="thick-eroded" operator="out" />
        <feComposite result="colored-inner-thin-eroded" in="edge-color" in2="clipped-inner-thin-eroded" operator="in" />
        <feColorMatrix
          result="darkened-inner-thin-eroded"
          in="colored-inner-thin-eroded" type="matrix" values={`
            0.5 0 0 0 0
            0 0.5 0 0 0
            0 0 0.5 0 0
            0 0 0 1 0
          `} />

        <feMorphology ref={outerErodeRef} result="outer-thin-eroded" in="copy" operator="erode" radius="1" />
        <feComposite result="clipped-outer-thin-eroded" in="copy" in2="outer-thin-eroded" operator="out" />
        <feComposite result="colored-outer-thin-eroded" in="edge-color" in2="clipped-outer-thin-eroded" operator="in" />
        <feColorMatrix
          result="darkened-outer-thin-eroded"
          in="colored-outer-thin-eroded" type="matrix" values={`
            0.7 0 0 0 0
            0 0.7 0 0 0
            0 0 0.7 0 0
            0 0 0 1 0
          `} />

        <feBlend result="inner-lined-edge" in="darkened-inner-thin-eroded" in2="colored-clipped-thick-eroded" mode="normal" />
        <feBlend result="edge" in="darkened-outer-thin-eroded" in2="inner-lined-edge" mode="normal" />

        <feSpecularLighting result="spec-main" specularExponent="20" specularConstant={0.5} lightingColor={lightColor}>
          <fePointLight x={mainLightPosition.x} y={mainLightPosition.y} z="100"/>
        </feSpecularLighting>

        <feSpecularLighting result="spec-sub" specularExponent="20" specularConstant={0.2} lightingColor={lightColor}>
          <fePointLight x={subLightPosition.x} y={subLightPosition.y} z="100"/>
        </feSpecularLighting>

        <feComposite result="shiny-edge-spec-main" in="edge" in2="spec-main" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
        <feComposite result="shiny-edge" in="shiny-edge-spec-main" in2="spec-sub" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
        <feComposite result="clipped-shiny-edge" in="shiny-edge" in2="edge" operator="in" />

        <feBlend in="clipped-shiny-edge" in2="SourceGraphic" mode="normal" />
      </filter>
    </InvisibleSvg>
    <FitContent ref={containerRef} style={{filter: `url(#${filterId})`}}>
      <FitContent style={{clipPath: `url(#${clipPathId})`}}>
        {children}
      </FitContent>
    </FitContent>
    </>
  )
}

CopperEdge.defaultProps = {
  edgeColor: "darkgoldenrod",
  edgeWidth: 5,
  edgeRadius: 15,
  visible: true,
  animated: true,
  lightAngle: 190,
  lightColor: "gold",
}

export default CopperEdge
