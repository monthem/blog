import React from "react";
import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import AnimatedRect from "./AnimatedRect";

export default defineStory({
  title: "Generic/AnimatedRect",
  component: AnimatedRect,
})

const Template = defineTemplate(AnimatedRect);

export const Test = defineModule(Template, {
  from: {
    width: 100,
    height: 100,
    backgroundColor: "red",
    overflow: "hidden",
  },
  to: {
    width: 32,
    height: 32,
  },
})

export const Underline = defineModule(Template, {
  from: {
    width: 0,
    height: 3,
    backgroundColor: "black",
  },
  to: {
    width: 500,
  },
})