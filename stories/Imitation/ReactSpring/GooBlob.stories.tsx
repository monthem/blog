import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import GooBlob from "./GooBlob";

export default defineStory({
  title: "Imitation/ReactSpring/GooBlob",
  component: GooBlob,
})

const Template = defineTemplate(GooBlob);

export const Example = defineModule(Template, {
  goos: [
    {color: "tomato", size: 120},
    {color: "dodgerblue", size: 200},
    {color: "mediumseagreen", size: 160},
  ]
});