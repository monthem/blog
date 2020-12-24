import * as d3 from "d3";
import { cpDistanceConstantForCircle } from "../../../../utils/path";
import { getNewPos } from "../../../../utils/number";

type Pos = {x: number; y: number; angle: number; spread: number};

type GooeyRectanglePathOption = {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  sideControlSpreadX?: number;
  sideControlSpreadY?: number;
}

type PointDefinition = {x: number, y: number, angle: number, spread: number};
const Points = {
  topLeftCornerStart: 0,
  topLeftCornerEnd: 1,
  topSideHead: 2,
  topSideCenter: 3,
  topSideTail: 4,
  topRightCornerStart: 5,
  topRightCornerEnd: 6,
  rightSideCenter: 7,
  bottomRightCornerStart: 8,
  bottomRightCornerEnd: 9,
  bottomSideHead: 10,
  bottomSideCenter: 11,
  bottomSideTail: 12,
  bottomLeftCornerStart: 13,
  bottomLeftCornerEnd: 14,
  leftSideCenter: 15,
};

export type GooeyRectanglePoints = keyof typeof Points;

const NumToPoint = Object.keys(Points).reduce((acc: {[index: number]: keyof typeof Points}, ele, i) => {
  acc[i] = ele as keyof typeof Points;
  return acc;
}, {})

const PointLength = Object.values(Points).length;

type RectanglePoints = {
  [K in GooeyRectanglePoints]: PointDefinition;
};

type PointUpdater = {
  [K in keyof Pos]?: ((prev: Pos[K]) => Pos[K]) | Pos[K]
};

export default class GooeyRectangleModel {
  private option: GooeyRectanglePathOption;
  initialPoints: RectanglePoints;
  points: RectanglePoints;
  history: RectanglePoints[] = [];
  constructor(option: GooeyRectanglePathOption) {
    this.option = option;
    this.points = GooeyRectangleModel.convertOptionToPoints(option);
    this.initialPoints = GooeyRectangleModel.convertOptionToPoints(option);
  }

  get pointCopy() {
    return JSON.parse(JSON.stringify(this.points))
  }

  reset() {
    const point = GooeyRectangleModel.convertOptionToPoints(this.option);
    this.history.push(point);
    this.points = point;
  }

  get(targetKey: keyof RectanglePoints) {
    return this.points[targetKey];
  }

  update(param1: ((prev: RectanglePoints) => RectanglePoints) | keyof RectanglePoints | RectanglePoints, param2?: PointUpdater) {
    if (typeof param1 === "function") {
      const copy = this.pointCopy;
      const updated = param1(copy);
      this.history.push(updated);
      this.points = updated;
    } else if (typeof param1 === "string" && param2 !== undefined) {
      const copy = this.pointCopy;
      Object.entries(param2).forEach(([key, funcOrValue]) => {
        const prevValue = copy[param1][key as keyof Pos];
        if (typeof funcOrValue === "function") {
          copy[param1][key as keyof Pos] = funcOrValue(prevValue);
        } else if (typeof funcOrValue === "number") {
          copy[param1][key as keyof Pos] = funcOrValue;
        }
      })

      this.history.push(copy);
      this.points = copy;
    } else if (typeof param1 === "object") {
      const updated = param1;
      this.history.push(updated);
      this.points = updated;
    }
  }

  move(key: keyof RectanglePoints, value: Pick<Pos, "x" | "y">) {
    const copy = this.pointCopy;
    copy[key] = value;
    const enumIndex = Points[key];
    const prevPointName = (enumIndex <= 0 ? NumToPoint[11] : NumToPoint[enumIndex - 1]) as keyof RectanglePoints;
    const nextPointName = (enumIndex >= 11 ? NumToPoint[0] : NumToPoint[enumIndex + 1]) as keyof RectanglePoints;
    const prevPoint = this.points[prevPointName];
    const nextPoint = this.points[nextPointName];
  }

  goBack() {
    const recent = this.history.pop();
    if (recent) this.points = recent;
  }

  getPath() {
    const {option, points} = this;
    const {x = 0, y= 0, width = 200, height = 100, borderRadius = 20} = option;
    const ctx = d3.path();

    if (borderRadius <= 0) {
      ctx.rect(x, y, width, height);
      return ctx.toString();
    }

    ctx.moveTo(points.topLeftCornerStart.x, points.topLeftCornerStart.y);

    const pointEntries = Object.entries(points);
    pointEntries.forEach(([, curPoint], i) => {
      const [, nextPoint] = i === pointEntries.length - 1 ? pointEntries[0] : pointEntries[i + 1];
      const cp1 = getNewPos({
        origin: curPoint,
        angle: curPoint.angle,
        distance: curPoint.spread,
      });
      const cp2 = getNewPos({
        origin: nextPoint,
        angle: nextPoint.angle + 180,
        distance: nextPoint.spread,
      });
      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, nextPoint.x, nextPoint.y);
    });

    ctx.closePath();
    return ctx.toString();
  }

  static convertOptionToPoints(option: GooeyRectanglePathOption): RectanglePoints {
    const {x = 0, y= 0, width = 200, height = 100, borderRadius = 20} = option;
    const sideControlSpreadX = option.sideControlSpreadX || (width - borderRadius * 2) * (1/4) * (1/2);
    const sideControlSpreadY = option.sideControlSpreadY || (height - borderRadius * 2) * (1/2) * (1/2);
    const circularCpDistance = cpDistanceConstantForCircle(4) * borderRadius;
    const sideWidth = width - borderRadius * 2;

    const points: RectanglePoints = {
      topLeftCornerStart: {x: x, y: y + borderRadius, angle: 270, spread: circularCpDistance},
      topLeftCornerEnd: {x: x + borderRadius, y, angle: 0, spread: circularCpDistance},
      topSideHead: {x: x + borderRadius + sideWidth * (1/4), y, angle: 0, spread: sideControlSpreadX},
      topSideCenter: {x: x + width / 2, y, angle: 0, spread: sideControlSpreadX},
      topSideTail: {x: x + borderRadius + sideWidth * (3/4), y, angle: 0, spread: sideControlSpreadX},
      topRightCornerStart: {x: x + width - borderRadius, y, angle: 0, spread: circularCpDistance},
      topRightCornerEnd: {x: x + width, y: y + borderRadius, angle: 90, spread: circularCpDistance},
      rightSideCenter: {x: x + width, y: y + height / 2, angle: 90, spread: sideControlSpreadY},
      bottomRightCornerStart: {x: x + width, y: y + height - borderRadius, angle: 90, spread: circularCpDistance},
      bottomRightCornerEnd: {x: x + width - borderRadius, y: y + height, angle: 180, spread: circularCpDistance},
      bottomSideHead: {x: x + borderRadius + sideWidth * (3/4), y: y + height, angle: 180, spread: sideControlSpreadX},
      bottomSideCenter: {x: x + width / 2, y: y + height, angle: 180, spread: sideControlSpreadX},
      bottomSideTail: {x: x + borderRadius + sideWidth * (1/4), y: y + height, angle: 180, spread: sideControlSpreadX},
      bottomLeftCornerStart: {x: x + borderRadius, y: y + height, angle: 180, spread: circularCpDistance},
      bottomLeftCornerEnd: {x: x, y: y + height - borderRadius, angle: 270, spread: circularCpDistance},
      leftSideCenter: {x, y: y + height / 2, angle: 270, spread: sideControlSpreadY},
    };

    return points;
  }

  
}