import { getAngle } from "./number"

type PosDescription = Pick<HTMLElement, 
  "clientHeight" | "clientLeft" | "clientTop" | "clientWidth"
>

export const getCenterPos = (ele: PosDescription) => {
  return {
    x: ele.clientLeft + ele.clientWidth / 2,
    y: ele.clientTop + ele.clientHeight / 2,
  }
}

export const getElementAngle = (from: PosDescription, to: PosDescription) => {
  return getAngle({
    from: getCenterPos(from),
    to: getCenterPos(to),
  });
}