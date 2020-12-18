import chroma from "chroma-js";
import React from "react";
import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import MasonryGrid, { MasonryGridProps } from "./MasonryGrid";

export default defineStory({
  title: "List/MasonryGrid",
  component: MasonryGrid,
})

const items = Array(15).fill(0).map(() => {
  const randomColor = chroma.random();
  const multiplier = Math.random() * 2 + 1;
  return {
    code: randomColor.hex(),
    height: {
      xs: 100 * multiplier,
      sm: 150 * multiplier,
      md: 200 * multiplier,
      lg: 250 * multiplier,
      xl: 300 * multiplier,
    }
  }
})

const Template = defineTemplate<MasonryGridProps<typeof items[number]>>(MasonryGrid);

export const Example = defineModule(Template, {
  items,
  width: 600,
  columnCount: 5,
  keyExtractor: (item) => item.code,
  lengthExtractor: (item, i) => item.height.xs,
  render: (item) => {
    return (
      <div style={{
        height: item.height.xs,
        width: "100%",
        color: "white",
        textShadow: "1px 1px #302222",
        backgroundColor: item.code,
        fontSize: 15,
        fontWeight: 900,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: `1px solid ${chroma(item.code).brighten().hex()}`,
        borderRadius: 10,
      }}>
        {item.code}
      </div>
    )
  },
  shuffleEvery: 2000,
});
