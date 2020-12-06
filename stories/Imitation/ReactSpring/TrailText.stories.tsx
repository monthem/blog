import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import TrailText from "./TrailText";

export default defineStory({
  title: "Imitation/ReactSpring/TrailText",
  component: TrailText,
})

const Template = defineTemplate(TrailText);

export const Example = defineModule(Template, {
  texts: ["바보", "똥꾸", "멍충이", "송충이"],
  direction: "column",
});