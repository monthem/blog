import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import Glow from "../../Filter/Glow";
import GlowHoverResponder from "./GlowHoverResponder";

export default defineStory({
  title: "Responder/HoverResponder/GlowHoverResponder",
  component: GlowHoverResponder,
})

const Template = defineTemplate(GlowHoverResponder);

export const Example = defineModule(Template, {
  children: (
    <div style={{
      width: 300,
      height: 90,
      backgroundColor: "goldenrod",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontWeight: 900,
      fontSize: 30,
    }}>
      환하게 빛난다
    </div>
  ),
});