import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import Heart from "./Heart";

export default defineStory({
  title: "Inspired/ReactSpring/Heart",
  component: Heart,
})

const Template = defineTemplate(Heart);

export const Example = defineModule(Template, {});