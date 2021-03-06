import React, { Component, RefObject, StyleHTMLAttributes } from 'react'
import { clampNumber, getAngle, getDistance, getNewPos,  } from '../../../utils/number';

export type JoystickProps = {
  strokeWidth?: number;
  size?: number;
  stroke?: string;
  stickColor?: string;
  stickSize?: number;
  /**
   * @param horizontal ranges from -1 to 1, -1 indicates left and 1 indicates right
   * @param vertical ranges from -1 to 1, -1 indicates top and 1 indicates down
  */
  onMove?: (horizontal: number, vertical: number) => any;
}

export default class Joystick extends Component<JoystickProps>{
  ballRef = React.createRef<SVGCircleElement>();
  padRef = React.createRef<SVGCircleElement>();
  constructor(props) {
    super(props);
    this.dragStick = this.dragStick.bind(this);
    this.startDrag = this.startDrag.bind(this);
  }

  static defaultProps: JoystickProps = {
    size: 200,
    stickColor: "blue",
    stroke: "black",
    strokeWidth: 5,
    stickSize: 40,
  }

  dragStick(e: MouseEvent) {
    const {ballRef, padRef, props} = this;
    const {
      onMove,
      strokeWidth,
    } = props;
    const {
      x: padX,
      y: padY,
      width: padWidth,
      height: padHeight
    } = padRef.current.getBoundingClientRect();
    const padCenter = {
      x: padX + padWidth / 2 + strokeWidth / 2,
      y: padY + padHeight / 2 + strokeWidth / 2
    };
    const mouseCenter = {x: e.clientX, y: e.clientY};
    const angleToCircle = getAngle({from: padCenter, to: mouseCenter});
    const distance = clampNumber(getDistance({from: padCenter, to: mouseCenter}), 0, padWidth / 2);
    const computedPos = getNewPos({
      origin: padCenter,
      angle: angleToCircle,
      distance,
    });
    ballRef.current.setAttribute("cx", `${computedPos.x - padX}px`);
    ballRef.current.setAttribute("cy", `${computedPos.y - padY}px`);

    const {
      x: ballX,
      y: ballY,
      width: ballWidth,
      height: ballHeight
    } = ballRef.current.getBoundingClientRect();
    const ballCenter = {x: ballX + ballWidth / 2 + strokeWidth / 2, y: ballY + ballHeight / 2 + strokeWidth / 2};
    const rightRatio = clampNumber((ballCenter.x - padCenter.x) / (padWidth / 2), -1, 1);
    const downRatio = clampNumber((ballCenter.y - padCenter.y) / (padHeight / 2), -1, 1);
    if (onMove) onMove(rightRatio, downRatio);
  }

  startDrag(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const {dragStick} = this;
    const endDrag = () => {
      window.removeEventListener("mousemove", dragStick);
      window.removeEventListener("mouseup", endDrag);
    };

    window.addEventListener("mouseup", endDrag);
    window.addEventListener("mousemove", dragStick);
  }

  render() {
    const {
      padRef,
      ballRef,
      startDrag,
    } = this;

    const {props} = this;
    const {
      size,
      stickColor,
      stroke,
      strokeWidth,
      stickSize,
    } = props;
    
    return (
      <svg
        style={{overflow: "visible"}}
        width={size}
        height={size}
        onMouseDown={startDrag}
      >
        <circle
          ref={padRef}
          strokeDasharray="8 2"
          stroke={stroke}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          r={size / 2 - strokeWidth / 2}
          fill="transparent"
        />
        <circle
          ref={ballRef}
          r={stickSize / 2}
          fill={stickColor}
          cx={size / 2}
          cy={size / 2}
          style={{pointerEvents: "none"}}
        />
      </svg>
    )
  }
}
