import Gooey, { GooeyProps } from "./Gooey"
import {defineStory, defineModule} from '../../utils/story';
import styled from "styled-components";

const TestComponent1 = styled.div`
  width: 150px;
  height: 60px;
  /* background-color: red; */
  background: linear-gradient(225deg, dodgerblue, violet);
  font-size: 15px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  top: 0;
  left: 0;
  font-weight: 900;
  border-radius: 10px;
  cursor: pointer;
`;

export default defineStory<GooeyProps>({
  title: "Filter/Gooey",
  component: Gooey,
  argTypes: {
    blurRadius: {control: {type: "range", min: 0, max: 20}},
    gooColor: {control: {type: "color"}},
    gooSize: {control: {type: "range", min: 0, max: 50}}
  }
});

const Template: React.FC<GooeyProps> = (args) => {
  return (
    <div>
      <Gooey {...args}>
        <TestComponent1>
          쫄깃쫄깃
        </TestComponent1>
      </Gooey>
    </div>
  )
};

export const Example = defineModule(Template, {

});
