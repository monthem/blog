import chroma from "chroma-js";
import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import BlockList, { BlockListProps } from "./BlockList";

export default defineStory({
  title: "List/BlockList",
  component: BlockList,
})

type ExampleItem = {
  name: string;
  strength: number;
}

const Template = defineTemplate<BlockListProps<ExampleItem>>(BlockList);


export const Example = defineModule(Template, {
  items: [
    {
      name: "김호빵",
      strength: 13321,
    },
    {
      name: "조찐빵",
      strength: 3544,
    },
    {
      name: "블랙피자",
      strength: 3332,
    },
    {
      name: "화이트갈릭",
      strength: 3332,
    },
    {
      name: "매콤닭똥꾸",
      strength: 3332,
    },
  ],
  render: (item, Entry, i) => {
    const color = chroma.random();
    return (
      <Entry
        text={item.name}
        style={{
          width: 200,
          backgroundColor: color.brighten().hex(),
          height: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: color.brighten().brighten().brighten().hex(),
          textShadow: "1px 1px 0px black",
          fontWeight: 900,
          fontSize: 25,
        }}
      />
    )
  }
});