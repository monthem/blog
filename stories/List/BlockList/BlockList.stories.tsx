import chroma from "chroma-js";
import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import BlockList, { BlockListProps } from "./BlockList";

type ExampleItem = {
  name: string;
  strength: number;
}

type BlockListArgs = {
  text: string;
}

export default defineStory<BlockListArgs>({
  title: "List/BlockList",
  component: BlockList,
  argTypes: {
    text: {control: {type: "text"}},
  }
})


const Template: React.FC<BlockListArgs> = (args) => {
  return (
    <div>
      <BlockList
        items={args.text.split(/\s/)}
        render={(item, Entry, i) => {
          const color = chroma.random();
          return (
            <Entry
              text={item}
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
        }}
      />
    </div>
  )
}

export const Example = defineModule(Template, {
  text: "코딩은 즐겁고 유익한 것이다"
});