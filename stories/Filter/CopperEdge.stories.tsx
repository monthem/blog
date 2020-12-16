import { defineModule, defineStory, defineTemplate } from "../../utils/story";
import CopperEdge from "./CopperEdge";

export default defineStory({
  title: "Filter/CopperEdge",
  component: CopperEdge,
})

const Template = defineTemplate(CopperEdge);

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
      진정 엣지가 있구나
    </div>
  ),
});