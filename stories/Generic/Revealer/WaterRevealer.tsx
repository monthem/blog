import * as popmotion from 'popmotion';
import React from 'react'
import {v4 as uuidv4} from 'uuid';
import {FitContent, InvisibleSvg} from '../../_Styled';

type WaterRevealerProps = {
  children: React.ReactNode;
  visible?: boolean;
}

const displacementScaleAnimation = ["-50", "45", "-38", "25", "-15", "8", "-5", "3", "0"];

const WaterRevealer: React.FC<WaterRevealerProps> = (props) => {
  const {
    children,
    visible,
  } = props;
  const displacementRef = React.useRef<SVGFEDisplacementMapElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const noiseSeed = React.useRef(Math.ceil(Math.random() * 100)).current;
  const nodeId = React.useRef(uuidv4()).current;
  const filterId = `${nodeId}-drop-water`;
  

  React.useEffect(() => {
    const rippleAnimation = visible ? popmotion.animate({
      to: displacementScaleAnimation,
      duration: 1000,
      ease: popmotion.linear,
      onUpdate: (latest) => {
        displacementRef.current.setAttribute("scale", latest);
      },
    }) : undefined;
    const opacityAnimation = popmotion.animate({
      from: containerRef.current.style.getPropertyValue("opacity") || "0",
      to: visible ? "1" : "0",
      duration: visible ? 1000 : 500,
      onUpdate: (latest) => {
        containerRef.current.style.setProperty("opacity", latest)
      }
    });
    return () => {
      if (rippleAnimation) rippleAnimation.stop();
      opacityAnimation.stop();
    }
  })


  return (
    <>
    <InvisibleSvg>
      <filter id={filterId} width="200%" height="200%" x="-50%" y="-50%">
        <feTurbulence result="noise" baseFrequency="0.05" type="fractalNoise" numOctaves="1" seed={noiseSeed}/>
        <feDisplacementMap result="displacement" ref={displacementRef} scale="-50" in="SourceGraphic" in2="noise"/>
      </filter>
    </InvisibleSvg>
    <FitContent ref={containerRef} style={{filter: `url(#${filterId})`}}>
      {children}
    </FitContent>
    </>
  )
}

export default WaterRevealer
