import chalk from 'chalk';
import { isAllTrue } from './condition';

type Position = {
  x: number;
  y: number;
}

export const clampNumber = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
}

type GetAngleParam = {
  from: Position, to: Position
}
export const getAngle = (param: GetAngleParam) => {
  const {from, to} = param;
  return Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
}

export const getDistance = (param: GetAngleParam) => {
  const {from, to} = param;
  return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
}

type GetNewPosParam = {
  origin: Position, angle: number, distance: number;
}
export const getNewPos = (param: GetNewPosParam) => {
  const {angle, distance, origin} = param;
  var result: Partial<Position> = {};  
  result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + origin.x);
  result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + origin.y);
  return result;
}

type InterpolationParam = {
  input: number[];
  output: number[];
}

export const interpolate = (param: InterpolationParam) => {
  const {input, output} = param;
  const paramIsOk = isAllTrue([
    [input.length < 2, `${chalk.red("Length limit")} of single interpolate is 2`],
    [input.length === output.length, `Inputs and outputs should have the ${chalk.red("same length of factors")}`]
  ])
  if (!paramIsOk) return;
  const [minInput, maxInput] = input;
  const [minOutput, maxOutput] = output;
  const outputDiff = maxOutput - minOutput;
  const inputDiff = maxInput - minInput;
  return (value: number) => {
    const progress = (value - minInput) / inputDiff;
    return minOutput + progress * outputDiff;
  }
}