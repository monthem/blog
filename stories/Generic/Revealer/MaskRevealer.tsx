import React from 'react'
import { animated, useSpring } from 'react-spring';
import styled, { CSSProperties } from 'styled-components';

const predefinedMasks = {
  slash: {
    from: "polygon(72% 0, 72% 0, 28% 100%, 28% 100%)",
    to: "polygon(44% 0, 100% 0, 56% 100%, 0 100%)",
  },
  triangle: {
    from: "polygon(50% 50%, 50% 50%, 50% 50%)",
    to: "polygon(50% 0%, 0% 100%, 100% 100%)"
  },
  frame: {
    from: "polygon(25% 25%, 25% 75%, 25% 75%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 75%, 75% 75%, 75% 25%)",
    to: "polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)"
  },
  "rectangle-vertical": {
    from: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
    to: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)",
  },
  "rectangle-horizontal": {
    from: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
    to: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)",
  }
}

type PredefinedMask = keyof typeof predefinedMasks;

export type MaskRevealerBaseProps = {
  reveal?: boolean;
  target?: JSX.Element;
  containerStyle?: Omit<CSSProperties, "width" | "height">;
  mask?: PredefinedMask;
  customMask?: {
    from: string;
    to: string;
  };
  delay?: number;
  precedingColor?: CSSProperties["color"];
  followingColor?: CSSProperties["color"];
  /**
   * @param easing this requires css easing function, for example: cubic-bezier(0.37, 0, 0.63, 1);
   */
  easings?: string;
  reverse?: boolean;
}

export type MaskRevealerProps = MaskRevealerBaseProps & {
  /**
   * @param alternate this enables the opposite animation of reveal. only affects when reverse={false}. 
   */
  alterante?: boolean;
  /**
   * @param concealDelay after ${concealDelay} has passed following color will shrink to invisible
   */
  concealDelay?: number;
}

type MaskedDivProps = {
  active?: boolean;
  from?: string;
  to?: string;
  delay?: number;
  easings?: string;
}
const MaskedDiv = styled.div<MaskedDivProps>`
  clip-path: ${({active, from ,to}) => active ?  to : from};
  transition: 0.6s ${({easings}) => easings || `cubic-bezier(0.37, 0, 0.63, 1)`};
  transition-delay: ${({delay}) => `${delay || 0}ms`};
`;

const MaskRevealerBase: React.FC<MaskRevealerBaseProps> = (props) => {
  const {
    target,
    reveal,
    containerStyle,
    mask = "slash",
    customMask,
    delay,
    precedingColor,
    easings,
    reverse,
  } = props;
  const {
    followingColor = precedingColor,
  } = props;
  const {from, to} = customMask || predefinedMasks[mask];
  const colorMaskRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const targetContainerRef = React.useRef<HTMLDivElement>(null);
  const [bbox, setBbox] = React.useState<DOMRect | null>(null);

  if (from.indexOf(";") !== -1 || to.indexOf(";") !== -1) throw new Error("You should not include ';' for clip-path");

  React.useEffect(() => {
    if (!targetContainerRef.current) return;
    if (!bbox) {
      const rect = targetContainerRef.current.getBoundingClientRect();
      setBbox(rect);
      containerRef.current.style.setProperty("width", `${rect.width}px`);
      containerRef.current.style.setProperty("height", `${rect.height}px`);
      colorMaskRef.current.style.setProperty("width", `${rect.width}px`);
      colorMaskRef.current.style.setProperty("height", `${rect.height}px`);
    }
  })

  return (
    <MaskedDiv
      active={reveal}
      style={{
        ...containerStyle,
        background: reveal ? followingColor : precedingColor,
      }}
      from={reverse
          ? reveal
            ? from : to
          : from}
      to={reverse
        ? reveal
          ? to : from
        : to}
      ref={colorMaskRef}
      easings={easings}
      delay={reveal ? 0 : delay}
    >
      <MaskedDiv
        active={reveal}
        from={from}
        to={to}
        delay={delay}
        ref={containerRef}
        style={containerStyle}
        easings={easings}
      >
        <div style={{position: "absolute"}} ref={targetContainerRef}>
          {target}
        </div>
      </MaskedDiv>
    </MaskedDiv>
  )
}

const MaskRevealer: React.FC<MaskRevealerProps> = (props) => {
  const {
    reveal: inheritedReveal,
    reverse: inheritedReverse,
    alterante = true,
    delay,
  } = props;

  const {concealDelay = delay} = props;

  const [state, setState] = React.useState({
    reveal: inheritedReveal,
    reverse: inheritedReverse,
    initialized: false,
  })
  const {reveal, reverse, initialized} = state;

  const updateState = (newState: Partial<typeof state>) => {
    setState({...state, ...newState});
  }

  React.useEffect(() => {
    if (!alterante || inheritedReverse || !initialized) {
      updateState({
        reverse: inheritedReverse,
        reveal: inheritedReveal,
        initialized: true,
      });
    } else {
      let timeout: number;
      if (inheritedReveal && !inheritedReverse) {
        updateState({
          reveal: true,
        })
      } else if (!inheritedReveal && !inheritedReverse) {
        updateState({
          reveal: false,
          reverse: true,
        })
        timeout = setTimeout(() => {
          updateState({
            reveal: false,
            reverse: false
          })
        }, concealDelay)
      }
  
      return () => {
        if (timeout !== undefined) {
          clearTimeout(timeout);
        }  
      }
    }
  }, [inheritedReveal, inheritedReverse, alterante])

  return (
    <MaskRevealerBase
      {...props}
      reveal={reveal}
      reverse={reverse}
    />
  )
}

export default MaskRevealer
