import { defineModule, defineStory, defineTemplate } from "../../utils/story";
import CopperEdge, { CopperEdgeProps } from "./CopperEdge";

export default defineStory<CopperEdgeProps>({
  title: "Filter/CopperEdge",
  component: CopperEdge,
  argTypes: {
    animated: {control: {type: "boolean"}},
    edgeColor: {control: {type: "color"}},
    edgeRadius: {control: {type: "range", min: 1, max: 20, step: 0.5}},
    edgeWidth: {control: {type: "range", min: 1, max: 20, step: 0.5}},
    lightAngle: {control: {type: "range", min: 0, max: 360, step: 1}},
    lightColor: {control: {type: "color"}},
    visible: {control: {type: "boolean"}},
  }
})

const Template: React.FC<CopperEdgeProps> = (args) => {
  return (
    <div>
      <CopperEdge {...args}>
        <div style={{
          width: 300,
          height: 90,
          backgroundColor: "dodgerblue",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontWeight: 900,
          fontSize: 30,
        }}>
          진정 엣지가 있구나
        </div>
      </CopperEdge>
    </div>
  )
}

export const Example = defineModule(Template, {
});