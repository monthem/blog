import styled from "styled-components";
import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import ShapeRevealer, { ShapeRevealerProps } from "./ShapeRevealer";

type ShapeRevealerArgs = Omit<ShapeRevealerProps, "children">;

const ExampleComponent = styled.div`
  font-size: 30px;
  font-weight: 900;
  padding: 10px;
  color: white;
`

export default defineStory<ShapeRevealerArgs>({
  title: "Generic/Revealer/ShapeRevealer",
  component: ShapeRevealer,
  argTypes: {
    visible: {control: {type: "boolean"}},
    backgroundColor: {control: {type: "color"}},
    backgroundColorOnEnd: {control: {type: "color"}},
    delay: {
      control: {
        type: "range",
        max: 1000,
        min: 0,
        step: 10,
      },
    },
    maskShape: {control: {type: "select", options: [
      "rectangleFromBottom", "rectangleFromHorizontalCenter", "rectangleFromLeft",
      "rectangleFromRight", "rectangleFromTop", "rectangleFromVerticalCenter", "triangle"
    ]}},
    precedingColor: {control: {type: "color"}},
  }
})

const Template: React.FC<ShapeRevealerArgs> = (props) => {
  return (
    <ShapeRevealer {...props}>
      <ExampleComponent>
        이야야야압
      </ExampleComponent>
    </ShapeRevealer>
  )
};

export const Example = defineModule(Template, {
  maskShape: "rectangleFromTop",
  backgroundColor: "yellow",
  precedingColor: "green",
  delay: 200,
});