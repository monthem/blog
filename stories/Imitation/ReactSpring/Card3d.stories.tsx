import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import Card3d from "./Card3d";

export default defineStory({
  title: "Imitation/ReactSpring/Card3d",
  component: Card3d,
})

const Template = defineTemplate(Card3d);

export const Example = defineModule(Template, {
  src: "https://jjalbot.com/media/2018/12/h2LxsAbPe/zzal.jpg",
});