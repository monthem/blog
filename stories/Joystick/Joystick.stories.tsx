import React from 'react';

import Joystick, { JoystickProps } from './Joystick';

export default {
  title: 'Animation/Controller/Joystick',
  component: Joystick,
};

const setProps = (props: JoystickProps) => props;

const Template = (args) => <Joystick {...args} />;

export const Small = Template.bind({});
Small.args = setProps({
  size: 100,
  stroke: "blue",
  stickColor: "dodgerblue",
  strokeWidth: 5,
  stickSize: 30,
})

export const Medium = Template.bind({});
Medium.args = setProps({
  size: 150,
  stroke: "blue",
  stickColor: "dodgerblue",
  strokeWidth: 5,
  stickSize: 40,
})

export const Big = Template.bind({});
Big.args = setProps({
  size: 200,
  stroke: "blue",
  stickColor: "dodgerblue",
  strokeWidth: 5,
  stickSize: 50,
})

