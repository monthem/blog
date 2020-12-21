import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import TrailText from "./TrailText";

type TrailTextArgs = {
  text: string;
  direction: "column" | "row";
}

export default defineStory<TrailTextArgs>({
  title: "Imitation/ReactSpring/TrailText",
  component: TrailText,
  argTypes: {
    text: {control: {type: "text"}},
    direction: {control: {type: "radio", options: ["column", "row"]}}
  }
})

const Template: React.FC<TrailTextArgs> = (args) => {
  return (
    <div>
      <TrailText texts={args.text.split(/\s/)} direction={args.direction} />
    </div>
  )
}

export const Example = defineModule<TrailTextArgs>(Template, {
  text: "바보 똥꾸 멍청이 송충이",
  direction: "column",
});