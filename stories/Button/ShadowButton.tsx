import { animate } from 'popmotion';
import React from 'react'
import { CSSProperties } from 'styled-components';
import { DropShadowProps } from '../Filter/DropShadow';
import ShadowHoverResponder from '../Responder/HoverResponder/ShadowHoverResponder';

const containerStyle: CSSProperties = {
  backgroundColor: "mediumseagreen",
  width: "fit-content",
  padding: 10,
  color: "white",
  fontWeight: 900,
  userSelect: "none",
  cursor: "pointer",
  border: "1px solid black",
};

type ShadowButtonProps = {
  style?: CSSProperties;
  shadowColor?: CSSProperties["backgroundColor"];
  offsetOnHover?: number;
  offsetOnIdle?: number;
  shadowAngle?: number;
  children: React.ReactNode;
  outlineColor?: DropShadowProps["outlineColor"];
  outlineWidth?: DropShadowProps["outlineWidth"];
} & React.HTMLProps<HTMLDivElement>;

const ShadowButton: React.FC<ShadowButtonProps> = (props) => {
  const {
    style,
    shadowColor,
    offsetOnHover,
    offsetOnIdle,
    shadowAngle,
    outlineColor,
    outlineWidth,
    ...divProps
  } = props;

  return (
    <ShadowHoverResponder
      outlineColor={outlineColor}
      outlineWidth={outlineWidth}
      shadowColor={shadowColor}
      shadowAngle={shadowAngle}
      offsetOnHover={offsetOnHover}
      offsetOnIdle={offsetOnIdle}>
      <div {...divProps} style={{...containerStyle, borderColor: outlineColor, borderWidth: outlineWidth}} />
    </ShadowHoverResponder>
  )
}

ShadowButton.defaultProps = {
  offsetOnHover: 10,
  offsetOnIdle: 3,
  shadowColor: "dodgerblue",
  shadowAngle: 45,
  outlineWidth: 1,
  outlineColor: "blue",
}

export default ShadowButton
