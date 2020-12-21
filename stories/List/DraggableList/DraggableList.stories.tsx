import chroma from "chroma-js";
import { animated, useSpring } from "react-spring";
import { defineModule, defineStory, defineTemplate } from "../../../utils/story";
import DraggableList, { DraggableListProps } from "./DraggableList";

type DraggableListArgs = {
  text: string;
}

export default defineStory<DraggableListArgs>({
  title: "List/DraggableList",
  component: DraggableList,
  argTypes: {
    text: {control: {type: "text"}},
  }
})

const Template: React.FC<DraggableListArgs> = (args) => {
  return (
    <div>
      <DraggableList
        items={args.text.split(/\s/)}
        render={(item, i) => {
          const [spring, setSpring] = useSpring(() => ({
            boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
          }))
          return (
            <div
              onMouseEnter={() => setSpring({boxShadow: "0px 0px 20px rgba(0,0,0,0.5)"})}
              onMouseOut={() => setSpring({boxShadow: "0px 0px 10px rgba(0,0,0,0.5)"})}
              style={{paddingTop: 10, paddingBottom: 10}}>
              <animated.div style={{
                paddingTop: 10 * (i + 1),
                paddingBottom: 10 * (i + 1),
                width: 300,
                backgroundColor: chroma.random().hex(),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                border: "1px solid blue",
                color: "white",
                fontWeight: 900,
                textShadow: "1px 1px 0px black",
                userSelect: "none",
                ...spring,
              }}>
                {item}
              </animated.div>
            </div>
          )
        }}
      />
    </div>
  )
}

export const Example = defineModule(Template, {
  text: "와 취준은 오래 하면 안되겠구나..."
});