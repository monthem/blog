import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import LegacyDraggableList from "./LegacyDraggableList";

export default defineStory({
  title: "List/LegacyDraggableList",
  component: LegacyDraggableList,
})

const Template = defineTemplate(LegacyDraggableList);

export const Example = defineModule(Template, {
  items: "Lorem ipsum dolor sit".toUpperCase().split(" "),
});