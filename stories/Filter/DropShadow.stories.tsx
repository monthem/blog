import { defineModule, defineStory, defineTemplate } from "../../utils/story";
import DropShadow from "./DropShadow";

export default defineStory({
  title: "Filter/DropShadow",
  component: DropShadow,
})

const Template = defineTemplate(DropShadow);

export const Example = defineModule(Template, {
  children: (
    <div style={{fontWeight: "bolder", color: "white", userSelect: "none"}}>
      이렇게
    </div>
  )
});