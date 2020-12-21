import styled, { CSSProperties } from "styled-components";
import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import WaterRevealer from "./WaterRevealer";

const TestText = styled.div<{color?: string}>`
  color: ${({color}) => color || "black"};
  font-weight: 900;
  font-size: 30px;
`;

type WaterRevealerArgs = {
  visible?: boolean;
  text?: string;
  textColor?: CSSProperties["color"];
}

export default defineStory<WaterRevealerArgs>({
  title: "Generic/Revealer/WaterRevealer",
  component: WaterRevealer,
  argTypes: {
    visible: {
      name: 'visible[P]',
      type: { name: 'boolean', required: false },
      defaultValue: true,
      description: 'controls visibility of children',
      control: { type: 'boolean' }
    },
    text: {
      name: 'text',
      type: { name: 'string', required: false },
      defaultValue: '물결이 치는구나',
      description: 'text for testing',
      control: { type: 'text' },
    },
    textColor: {
      defaultValue: "dodgerblue",
      control: { type: 'color' }
    }
  }
})

const Template: React.FC<WaterRevealerArgs> = ({visible, text, textColor}) => {
  return (
    <WaterRevealer visible={visible}>
      <TestText color={textColor}>{text}</TestText>
    </WaterRevealer>
  )
};

export const Example = defineModule(Template, {
});