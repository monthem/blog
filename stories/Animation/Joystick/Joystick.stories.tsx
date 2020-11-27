import React from 'react';

import Joystick, { JoystickProps } from './Joystick';

export default {
  title: 'Animation/Joystick',
  component: Joystick,
};

const setProps = (props: JoystickProps) => props;

const Template = (args) => <Joystick {...args} />;

export const Tester = Template.bind({});
Tester.args = setProps({
  size: 200,
  stroke: "blue",
  stickColor: "dodgerblue",
  strokeWidth: 5,
  stickSize: 50,
})

