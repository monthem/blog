import { defineModule, defineStory, defineTemplate } from "../../utils/story";
import Glow, { GlowProps } from "./Glow";

export default defineStory<GlowProps>({
  title: "Filter/Glow",
  component: Glow,
  argTypes: {
    glow: {control: {type: "boolean"}},
    animated: {control: {type: "boolean"}},
    blurRadius: {control: {type: "range", min: 0, max: 30}},
    intensity: {control: {type: "range", min: 0, max: 1, step: 0.01}}
  }
});

const Template: React.FC<GlowProps> = (args) => {
  return (
    <div>
      <Glow {...args}>
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
      </Glow>
    </div>
  )
};

export const Example = defineModule(Template, {});