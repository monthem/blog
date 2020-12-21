import { defineModule, defineStory, defineTemplate } from "../../utils/story";
import DropShadow, { DropShadowProps } from "./DropShadow";

export default defineStory<DropShadowProps>({
  title: "Filter/DropShadow",
  component: DropShadow,
  argTypes: {
    angle: {control: {type: "range", min: 0, max: 360}},
    interval: {control: {type: "range", min: 0, max: 20}},
    blurRadius: {control: {type: "range", min: 0, max: 20}},
    visible: {control: {type: "boolean"}},
    animated: {control: {type: "boolean"}},
    fixedStep: {control: {type: "range", min: 1, max: 100}},
    mode: {control: {type: "radio", options: ["continuos", "discrete"]}},
    offset: {control: {type: "range", min: 0, max: 20}},
    outlineColor: {control: {type: "color"}},
    outlineWidth: {control: {type: "range", min: 0, max: 10}},
    shadowColor: {control: {type: "color"}},
  }
})

const Template: React.FC<DropShadowProps> = (args) => {
  return (
    <div>
      <DropShadow {...args}>
        <div style={{fontWeight: "bolder", color: "tomato", userSelect: "none"}}>
          이렇게
        </div>
      </DropShadow>
    </div>
  )
}

export const Example = defineModule(Template, {});