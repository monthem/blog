import _ from "lodash";

type SupportedDirection = "vertical" | "horizontal";

type GetMasonryGridGuideOption = {
  direction: SupportedDirection;
  column: number;
  variableLength: number[];
  margin: number;
  gridItemWidth: number;
}

type MasonryGridGuide = {[index: number]: [number, number]}

const getMasonryGridGuide = (option: GetMasonryGridGuideOption): MasonryGridGuide => {
  const guide: MasonryGridGuide = {};
  const {column, variableLength, margin, direction, gridItemWidth} = option;
  const layout: number[][] = Array(column).fill(0).map(() => []);
  const pickShortest = () => layout.reduce((shortest, column, i) => {
    if (_.sum(column) < _.sum(layout[shortest])) return i;
    return shortest;
  }, 0)
  for (let i = 0; i < variableLength.length; i += 1) {
    const targetColumn = pickShortest();
    const interestedLength = variableLength[i];
    const existingGridItemHeightTotal = _.sum(layout[targetColumn]);
    const existingGridItemLength = layout[targetColumn].length;
    layout[targetColumn].push(interestedLength);
    const x = targetColumn * gridItemWidth;
    const y = existingGridItemHeightTotal;
    const dx = targetColumn > 0 ? targetColumn * margin : 0;
    const dy = existingGridItemLength > 0 ? existingGridItemLength * margin : 0;
    guide[i] = direction === "vertical" ? [x + dx, y + dy] : [y + dy, x + dx];
  }
  return guide;
}

export default {
  getMasonryGridGuide,
}