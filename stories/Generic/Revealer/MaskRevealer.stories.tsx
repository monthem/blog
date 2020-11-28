import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import MaskRevealer from "./MaskRevealer";

export default defineStory({
  title: "Generic/Revealer/MaskRevealer",
  component: MaskRevealer,
})

const Template = defineTemplate(MaskRevealer);

export const Test = defineModule(Template, {
  target: (
    <div style={{
      width: 300,
      height: 50,
      background: "black",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      color: "white",
    }}>
      오
    </div>
  ),
  mask: "triangle",
  delay: 200,
  precedingColor: "blue",
  easings: "cubic-bezier(0.76, 0, 0.24, 1)",
  followingColor: "red",
});