import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import CircleRevealer, { CircleRevealerProps } from "./CircleRevealer";

export default defineStory<CircleRevealerProps>({
  title: "Generic/Revealer/CircleRevealer",
  component: CircleRevealer,
  argTypes: {
    visible: {control: {type: "boolean"}},
  }
})

const Template: React.FC<CircleRevealerProps> = (args) => {
  return (
    <div>
      <CircleRevealer {...args}>
        <div style={{
            padding: 30,
            backgroundColor: "dodgerblue",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontWeight: 900,
            fontSize: 30,
            borderRadius: 5,
          }}>
          둥글게 둥글게
        </div>
      </CircleRevealer>
    </div>
  )
};

export const Example = defineModule(Template, {});