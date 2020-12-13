import { defineModule, defineStory, defineTemplate } from "../../utils/story";
import ShadowButton from "./ShadowButton";

export default defineStory({
  title: "Button/ShadowButton",
  component: ShadowButton,
})

const Template = defineTemplate(ShadowButton);

export const Example = defineModule(Template, {
  children: "테스트 버튼"
});