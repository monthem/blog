import React from 'react'
import { useGesture } from 'react-use-gesture';
import { wrapStart } from 'react-use-gesture/dist/hooks/useGesture';
import { getAngle, getDistance } from '../../../utils/number';
import DropShadow, { DropShadowProps } from '../../Filter/DropShadow';

type ShadowMoveResponderProps = {
  children: React.ReactNode;
  shadowColor?: DropShadowProps["shadowColor"];
  shadowType?: DropShadowProps["mode"];
  interval?: DropShadowProps["interval"];
  blurRadius?: DropShadowProps["blurRadius"];
  fixedStep?: DropShadowProps["fixedStep"];
  outlineColor?: DropShadowProps["outlineColor"];
  outlineWidth?: DropShadowProps["outlineWidth"];
  minOffset?: number;
  maxOffset?: number;
  /**@param pixelToOffsetRatio
   * By default, offset is calculated by dividing distance by 100.
   * That is, when the distance between cursor and chidren center is 1000px, offset is 10.
   * To increase sensitivity, we can decrease pixelToOffsetRatio.
  */
  pixelToOffsetRatio?: number;
}

const ShadowMoveResponder: React.FC<ShadowMoveResponderProps> = (props) => {
  const {
    children,
    shadowColor,
    interval,
    maxOffset,
    minOffset,
    shadowType,
    blurRadius,
    fixedStep,
    outlineColor,
    outlineWidth,
  } = props;
  const pixelToOffsetRatio = Math.max(props.pixelToOffsetRatio, 1);
  const [angle, setAngle] = React.useState(0);
  const [offset, setOffset] = React.useState(0);
  const childContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onMouseMove = (ev: MouseEvent) => {
      const {x: wx, y: wy} = ev;
      const childContainerRect = childContainerRef.current.getBoundingClientRect();
      const {left, top, width, height} = childContainerRect;
      const childContainerCenter = {
        x: left + width / 2,
        y: top + height / 2,
      };
      const from = {x: wx, y: wy};
      const to = {x: childContainerCenter.x, y: childContainerCenter.y};
      const angleToChildContainerCenter = getAngle({ from, to });
      const distance = getDistance({ from, to });
      const calcedOffset = Math.max(Math.min(distance / pixelToOffsetRatio, maxOffset), minOffset);
      setAngle(angleToChildContainerCenter);
      setOffset(calcedOffset);
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    }
  })

  return (
    <DropShadow
      shadowColor={shadowColor}
      mode={shadowType}
      interval={interval}
      offset={offset}
      blurRadius={blurRadius}
      angle={angle}
      outlineColor={outlineColor}
      outlineWidth={outlineWidth}
      fixedStep={fixedStep}
      animated={false}>
      <div ref={childContainerRef} style={{width: "fit-content", height: "fit-content"}}>
        {children}
      </div>
    </DropShadow>
  )
}

ShadowMoveResponder.defaultProps = {
  interval: 2,
  maxOffset: 10,
  minOffset: 0,
  shadowColor: "blue",
  shadowType: "continuos",
  blurRadius: 2,
  pixelToOffsetRatio: 100,
  fixedStep: 5,
  outlineColor: "black",
  outlineWidth: 1,
}

export default ShadowMoveResponder
