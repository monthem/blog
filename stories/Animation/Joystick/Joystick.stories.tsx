import React from 'react';
import { defineStory, defineTemplate } from '../../../utils/story';

import Joystick, { JoystickProps } from './Joystick';

export default defineStory<JoystickProps>({
  title: 'Animation/Joystick',
  component: Joystick,
  argTypes: {
    strokeWidth: {control: {type: "range", min: 1, max:10, step: 0.1}},
    stickSize: {control: {type: "range", min: 10, max:100, step: 1}},
    size: {control: {type: "range", min: 100, max:300, step: 10}},
    stroke: {control: {type: "color"}},
    stickColor: {control: {type: "color"}},
  }
});

const setProps = (props: JoystickProps) => props;

const Template = defineTemplate(Joystick);

export const Tester = Template.bind({});
Tester.args = setProps({
  size: 200,
  stroke: "blue",
  stickColor: "dodgerblue",
  strokeWidth: 5,
  stickSize: 50,
})

