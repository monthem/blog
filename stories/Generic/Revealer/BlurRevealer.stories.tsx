import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import BlurRevealer from "./BlurRevealer";

export default defineStory({
  title: "Generic/Revealer/BlurRevealer",
  component: BlurRevealer,
})

const Template = defineTemplate(BlurRevealer);

export const Example = defineModule(Template, {
  visible: true,
  children: (
    <div>
      ㅇㄹㄴㅇㅁㄹㅇㄴㅁㄹㄴ
    </div>
  ),
});