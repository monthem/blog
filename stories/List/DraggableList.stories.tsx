import chroma from "chroma-js";
import { animated, useSpring } from "react-spring";
import { defineModule, defineStory, defineTemplate } from "../../utils/story";
import DraggableList, { DraggableListProps } from "./DraggableList";

export default defineStory({
  title: "List/DraggableList",
  component: DraggableList,
})

const Template = defineTemplate<DraggableListProps<Person>>(DraggableList);

type Person = {
  name: string;
  age: number;
}

export const Example = defineModule(Template, {
  items: [
    {
      name: "Kelvin",
      age: 15,
    },
    {
      name: "Alice",
      age: 18,
    },
    {
      name: "Darwin",
      age: 123,
    },
    {
      name: "JinKuk",
      age: 12,
    },
    {
      name: "Michael",
      age: 39,
    },
  ],
  render: (item, i) => {
    const {name, age} = item;
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
          {name} is {age} years old!
        </animated.div>
      </div>
    )
  },
  onOrderChanged: (items) => console.log(items)
});