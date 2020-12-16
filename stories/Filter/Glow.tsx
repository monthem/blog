import { animate } from 'popmotion';
import React from 'react'
import { v4 } from 'uuid';
import { FitContent, InvisibleSvg } from '../_Styled';

export type GlowProps = {
  children: React.ReactNode;
  glow?: boolean;
  /**@param intensity defines glow intensity. from 0 to 1 */
  intensity?: number;
  blurRadius?: number;
  animated?: boolean;
}

const Glow: React.FC<GlowProps> = (props) => {
  const {
    children,
    glow,
    intensity,
    blurRadius,
    animated,
  } = props;
  const nodeId = React.useRef(v4()).current;
  const filterId = `${nodeId}-shiny-filter`;
  const clipPathId = `${nodeId}-shiny-clip-path`;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const outlineWidth = 3;
  const outlineColorMatrix = React.useRef<SVGFEColorMatrixElement>(null);
  const contentColorMatrix = React.useRef<SVGFEColorMatrixElement>(null);

  React.useEffect(() => {
    const animation = animate({
      from: outlineColorMatrix.current.getAttribute("values"),
      to: `
        1.5 0 0 0 0
        0 1.5 0 0 0
        0 0 1.5 0 0
        0 0 0 ${glow ? intensity : 0} 0
      `,
      duration: animated ? undefined : 0,
      onUpdate: (latest) => {
        outlineColorMatrix.current.setAttribute("values", latest);
        contentColorMatrix.current.setAttribute("values", latest);
      }
    })
    return () => {
      if (animation) animation.stop();
    }
  })

  return (
    <>
    <InvisibleSvg>
      <filter x="-50%" y="-50%" width="200%" height="200%" id={filterId}>
        <feMorphology result="thin-erode" in="SourceAlpha" operator="erode" radius="1" />
        <feComposite result="thin-outline" in="SourceGraphic" in2="thin-erode" operator="out" />
        <feColorMatrix result="lightened-thin-outline" in="thin-outline" type="matrix" values={`
          2 0 0 0 0
          0 2 0 0 0
          0 0 2 0 0
          0 0 0 0.5 0
        `}/>
        
        <feMorphology result="thick-erode" in="SourceAlpha" operator="erode" radius={outlineWidth} />
        <feComposite result="thick-outline" in="SourceGraphic" in2="thick" operator="out" />
        <feGaussianBlur result="blurred-thick-outline" in="thick-outline" stdDeviation={outlineWidth} />
        <feColorMatrix ref={outlineColorMatrix} result="lightened-thick-outline" in="blurred-thick-outline" type="matrix" values={`
          1.5 0 0 0 0
          0 1.5 0 0 0
          0 0 1.5 0 0
          0 0 0 0.3 0
        `}/>

        <feBlend result="outline-lightened" in="lightened-thin-outline" in2="lightened-thick-outline" mode="normal" />

        <feGaussianBlur result="blurred-content" in="SourceGraphic" stdDeviation={blurRadius} />
        <feColorMatrix ref={contentColorMatrix} result="content-lightened" in="blurred-content" type="matrix" values={`
          1.5 0 0 0 0
          0 1.5 0 0 0
          0 0 1.5 0 0
          0 0 0 0.3 0
        `} />

        <feBlend result="light" in="outline-lightened" in2="content-light" mode="screen" />
        <feBlend in="light" in2="SourceGraphic" mode="screen" />
      </filter>
    </InvisibleSvg>
    <FitContent ref={containerRef} style={{filter: `url(#${filterId})`}}>
      {children}
    </FitContent>
    </>
  )
}

Glow.defaultProps = {
  intensity: 0.5,
  blurRadius: 2,
  animated: true,
  glow: true,
}

export default Glow
