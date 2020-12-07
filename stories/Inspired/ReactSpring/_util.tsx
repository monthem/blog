import { CSSProperties } from 'react';
import _styled from './_styled';

const {
  Flex,
  HeartBottom,
  HeartLeft,
  HeartRight,
  HeartTop
} = _styled;

type HeartPartDirection = "top" | "left" | "right" | "bottom";

const idxToPart = {
  0: "bottom",
  1: "left",
  2: "right",
  3: "top",
} as const;

const HeartParts: {[T in HeartPartDirection]: typeof HeartTop} = {
  top: HeartTop,
  left: HeartLeft,
  right: HeartRight,
  bottom: HeartBottom,
}

const HeartAnimationDefinition: {
  [T in HeartPartDirection]: {
    rest: CSSProperties["transform"],
    pump: CSSProperties["transform"],
  }
} = {
  top: {
    rest: "scale(1) rotateX(-30deg) rotateY(-5deg) translate3d(0px, -80px, 0px)",
    pump: "scale(0.9) rotateX(-10deg) rotateY(-15deg) translate3d(0px, -80px, 0px)"
  },
  left: {
    rest: "scale(1) rotateY(10deg) translate3d(-10px, 0px, 0px)",
    pump: "scale(1.1) rotateY(-10deg) translate3d(-10px, -20px, 0px)",
  },
  right: {
    rest: "scale(1) rotateY(10deg) translate3d(60px, -10px, 0px)",
    pump: "scale(1.1) rotateY(20deg) translate3d(60px, -20px, 0px)"
  },
  bottom: {
    rest: "scaleY(1) rotateX(5deg) rotateY(0deg) translate3d(30px, 60px, 0px)",
    pump: "scaleY(0.95) rotateX(30deg) rotateY(20deg) translate3d(25px, 55px, 0px)",
  }
}

export default {
  idxToPart,
  HeartParts,
  HeartAnimationDefinition,
}