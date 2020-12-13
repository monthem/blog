import styled from 'styled-components';
import {defineModule, defineStory, defineTemplate} from '../../../utils/story'
import ShadowMoveResponder from './ShadowMoveResponder';

const TestText = styled.div`
  font-weight: 900;
  color: white;
  font-size: 100px;
`;

export default defineStory({
  title: "Responder/MoveResponder/ShadowMoveResponder",
  component: ShadowMoveResponder,
})

const Template = defineTemplate(ShadowMoveResponder);

export const Example = defineModule(Template, {
  children: (
    <div style={{
      width: 600,
      height: 600,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"}}>
      <TestText>
        흐랴아아아압
      </TestText>
    </div>
  ),
  maxOffset: 10,
  pixelToOffsetRatio: 30,
  interval: 5,
  shadowType: "continuos",
  blurRadius: 0,
  fixedStep: 5,
});