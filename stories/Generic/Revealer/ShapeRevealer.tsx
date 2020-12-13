import * as d3 from 'd3';
import React from 'react'
import styled, { CSSProperties, Keyframes, keyframes } from 'styled-components';

const clipPath = {
  triangle: {
    from: "polygon(50% 50%, 50% 50%, 50% 50%)",
    to: "polygon(50% 0%, 0% 100%, 100% 100%)",
  },
  rectangleFromLeft: {
    from: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
    to: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
  },
  rectangleFromRight: {
    from: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
    to: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
  },
  rectangleFromBottom: {
    from: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
    to: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
  },
  rectangleFromTop: {
    from: "polygon(0 0, 100% 0, 100% 0, 0 0)",
    to: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
  },
  rectangleFromHorizontalCenter: {
    from: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
    to: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
  },
  rectangleFromVerticalCenter: {
    from: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
    to: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
  }
}

type MaskedDivProps = {
  visible?: boolean;
  maskShape?: keyof typeof clipPath;
  backgroundColor?: CSSProperties["backgroundColor"];
  delay?: number;
}

const MaskedDiv = styled.div<MaskedDivProps>`
  clip-path: ${({maskShape, visible}) => visible ? clipPath[maskShape].to : clipPath[maskShape].from};
  width: fit-content;
  transition: clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-color 1s;
  background-color: ${({backgroundColor}) => backgroundColor};
  transition-delay: ${({delay}) => `${delay}ms`};
  will-change: clip-path;
`;

type ShapeRevealerProps = MaskedDivProps & {
  children?: React.ReactNode;
  precedingColor?: CSSProperties["backgroundColor"];
  backgroundColorOnEnd?: CSSProperties["backgroundColor"];
  style?: CSSProperties;
};

const ShapeRevealer: React.FC<ShapeRevealerProps> = (props) => {
  const {children, visible, delay, maskShape, backgroundColorOnEnd, style} = props;
  const [precedingColor, setPrecedingColor] = React.useState(props.precedingColor);
  const [backgroundColor, setBackgroundColor] = React.useState(props.backgroundColor);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPrecedingColor(visible ? "transparent" : props.precedingColor);
      setBackgroundColor(visible ? backgroundColorOnEnd : props.backgroundColor);
    }, delay * 2);
    return () => {
      if (timeout) clearTimeout(timeout);
    }
  })

  return (
    <div style={{overflow: "hidden", margin: 0, padding: 0, ...style}}>
      <MaskedDiv delay={visible ? 0 : delay} visible={visible} maskShape={maskShape} backgroundColor={precedingColor}>
        <MaskedDiv delay={visible ? delay : 0} visible={visible} maskShape={maskShape} backgroundColor={backgroundColor}>
          {children}
        </MaskedDiv>
      </MaskedDiv>
    </div>
  )
}

ShapeRevealer.defaultProps = {
  maskShape: "triangle",
  backgroundColor: "red",
  precedingColor: "blue",
  backgroundColorOnEnd: "violet",
}

export default ShapeRevealer
