import styled from "styled-components";
import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import GooBlob, { GooBlobProps } from "./GooBlob";

export default defineStory({
  title: "Imitation/ReactSpring/GooBlob",
  component: GooBlob,
})

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Template: React.FC<GooBlobProps> = (args) => {
  return (
    <Container>
      <GooBlob {...args} />
    </Container>
  )
}

export const Example = defineModule(Template, {
  goos: [
    {color: "tomato", size: 120},
    {color: "dodgerblue", size: 200},
    {color: "mediumseagreen", size: 160},
  ]
});