import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import BlurRevealer, { BlurRevealerProps } from "./BlurRevealer";

export default defineStory<BlurRevealerProps>({
  title: "Generic/Revealer/BlurRevealer",
  component: BlurRevealer,
  argTypes: {
    blurRadius: {control: {type: "range", min: 0, max: 100}},
    visible: {control: {type: "boolean"}},
  }
})

const Template: React.FC<BlurRevealerProps> = (args) => {
  return (
    <div>
      <BlurRevealer {...args}>
        <div style={{color: "black", fontWeight: 900, fontSize: 50}}>
          선생님 눈이 안 보입니다
        </div>
      </BlurRevealer>
    </div>
  )
}

export const Example = defineModule(Template, {});