import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import ShadowHoverResponder from "./ShadowHoverResponder";

export default defineStory({
  title: "Responder/HoverResponder/ShadowHoverResponder",
  component: ShadowHoverResponder,
})

const Template = defineTemplate(ShadowHoverResponder);

export const Example = defineModule(Template, {
  children: (
    <div style={{
      backgroundColor: "red",
      width: 200,
      height: 100,
      display: "flex",
      color: "white",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid black"
    }}>
      이렇게 작동하는 거임
    </div>
  ),
  shadowInterval: 0.5,
});