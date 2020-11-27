import React, { RefObject } from 'react'
import { animated, useSpring } from 'react-spring';

export type RevealerBaseProps = {
  reveal?: boolean;
  target?: JSX.Element;
  direction?: "horizontal" | "vertical";
}

export type RevealerProps = RevealerBaseProps & {
  alternate?: boolean;
}

const RevealerBase: React.FC<RevealerBaseProps> = (props) => {
  const {target, reveal, direction} = props;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const targetContainerRef = React.useRef<HTMLDivElement>(null);
  const [bbox, setBbox] = React.useState<DOMRect>();
  const sizePropTarget = direction === "horizontal" ? "width" : "height";
  const staticSizeProp = direction === "horizontal" ? "height" : "width";
  const revealAnimation = useSpring({
    overflow: "hidden",
    backgroundColor: "blue",
    [sizePropTarget]: reveal && bbox ? bbox[sizePropTarget] : 0,
    [staticSizeProp]: bbox ? bbox[staticSizeProp] : 0,
    opacity: reveal && bbox ? 1 : 0,
  })

  React.useEffect(() => {
    if (!targetContainerRef.current) return;
    if (!bbox) {
      const rect = targetContainerRef.current.getBoundingClientRect();
      setBbox(rect);
      containerRef.current.style.setProperty(staticSizeProp, `${rect[staticSizeProp]}px`);
      containerRef.current.removeChild(targetContainerRef.current);
      const relativeDiv = document.createElement("div");
      relativeDiv.setAttribute("style", `
        position: relative;
        width: ${rect.width}px;
        height: ${rect.height}px;
      `)
      relativeDiv.appendChild(targetContainerRef.current);
      containerRef.current.appendChild(relativeDiv);
    }
  })

  if (!target) return <></>;
  return (
    <animated.div
      ref={containerRef}
      style={revealAnimation}
    >
      <div ref={targetContainerRef} style={{position: "absolute"}}>
        {target}
      </div>
    </animated.div>
  );
}

const Revealer: React.FC<RevealerProps> = (props) => {
  const {
    alternate,
    direction: initialDirection,
    reveal,
    target,
  } = props;

  const [direction, setDirection] = React.useState(initialDirection);

  React.useEffect(() => {
    if (!reveal && alternate) {
      if (direction === "horizontal") {
        setDirection("vertical");
      } else {
        setDirection("horizontal");
      }
    }
  }, [reveal])

  return <RevealerBase
    direction={direction}
    reveal={reveal}
    target={target}
  />
}

export default Revealer
