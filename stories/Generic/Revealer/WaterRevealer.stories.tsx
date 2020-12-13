import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import WaterRevealer from "./WaterRevealer";

export default defineStory({
  title: "Generic/Revealer/WaterRevealer",
  component: WaterRevealer,
})

const Template = defineTemplate(WaterRevealer);

export const Example = defineModule(Template, {
  children: (
    <div style={{
      fontWeight: 900,
      fontSize: 40,
      width: 400,
      height: 400,
      display: "flex",
      justifyContent: "center",
      alignItems: "center", 
      color: "tomato",
      userSelect: "none",
    }}>
      물방울
    </div>
  )
});