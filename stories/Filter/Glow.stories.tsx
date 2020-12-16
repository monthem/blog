import { defineModule, defineStory, defineTemplate } from "../../utils/story";
import Glow from "./Glow";

export default defineStory({
  title: "Filter/Glow",
  component: Glow,
});

const Template = defineTemplate(Glow);

export const Example = defineModule(Template, {
  children: (
    <div style={{
        width: 300,
        height: 90,
        backgroundColor: "dodgerblue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontWeight: 900,
        fontSize: 30,
      }}>
      환하게 더 환하게
    </div>
  ),
  glow: true,
});