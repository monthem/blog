import React from "react";
import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import UnderlinedButton from "./UnderlinedButton";

export default defineStory({
  title: "Generic/UnderlinedButton",
  component: UnderlinedButton,
})

const Template = defineTemplate(UnderlinedButton);

export const Test = defineModule(Template, {
})