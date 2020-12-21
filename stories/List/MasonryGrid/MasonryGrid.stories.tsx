import chroma from "chroma-js";
import React from "react";
import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import MasonryGrid, { MasonryGridProps } from "./MasonryGrid";

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

type MasonryGridArgs = Pick<MasonryGridProps<typeof items[number]>, "columnCount" | "width" | "shuffleEvery">;

export default defineStory<MasonryGridArgs>({
  title: "List/MasonryGrid",
  component: MasonryGrid,
  argTypes: {
    columnCount: {control: {type: "range", min: 1, max: 10, step: 1}},
    width: {control: {type: "range", min: 200, max: 2000, step: 10}, defaultValue: 200},
    shuffleEvery: {control: {type: "range", min: 1000, max: 10000, step: 1000}, defaultValue: 2000},
  }
})

const Template: React.FC<MasonryGridArgs> = (args) => {
  return (
    <div style={{width: "100vw", height: "100vh", display: "flex", justifyContent: "center"}}>
      <MasonryGrid
        {...args}
        items={items}
        keyExtractor={(item) => item.code}
        lengthExtractor={(item) => item.height.xs}
        render={(item) => {
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
        }}
      />
    </div>
  )
}

export const Example = defineModule<MasonryGridArgs>(Template, {
  columnCount: 2,
  shuffleEvery: 2000,
  width: 360,
})