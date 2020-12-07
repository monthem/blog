import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import ShapeRevealer from "./ShapeRevealer";

export default defineStory({
  title: "Generic/Revealer/ShapeRevealer",
  component: ShapeRevealer,
})

const Template = defineTemplate(ShapeRevealer);

export const Example = defineModule(Template, {
  children: (
    <div style={{padding: 10}}>
      ㅇㄹㅇㄴㅁㄻㄴㅇfdsafdsa
    </div>
  ),
  maskShape: "rectangleFromTop",
  backgroundColor: "yellow",
  precedingColor: "green",
  delay: 200,
});