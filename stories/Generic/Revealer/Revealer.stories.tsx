import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import Revealer from "./Revealer";

export default defineStory({
  title: "Generic/Revealer",
  component: Revealer,
})

const Template = defineTemplate(Revealer);

export const Test = defineModule(Template, {
  target: (
    <div style={{color: "white", padding: 10}}>
      아주 아주 간단한 리빌러
    </div>
  ),
  direction: "vertical"
});