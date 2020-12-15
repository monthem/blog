import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import CircleRevealer from "./CircleRevealer";

export default defineStory({
  title: "Generic/Revealer/CircleRevealer",
  component: CircleRevealer,
})

const Template = defineTemplate(CircleRevealer);

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
        borderRadius: 5,
      }}>
      짜잔!
    </div>
  )
});