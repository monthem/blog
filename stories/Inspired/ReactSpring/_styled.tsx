import { animated } from "react-spring";
import styled, { css } from "styled-components";

const commonCss = css`
  box-sizing: border-box;
  position: absolute;
`;

const HeartBottom = styled(animated.div)`
  width: 100px;
  height: 120px;
  background-color: dodgerblue;
  border-radius: 50%;
  border-bottom: 20px solid blue;
  box-shadow: 0 0 20px 10px red;
  ${commonCss}
`;


const HeartLeft = styled(animated.div)`
  width: 100px;
  height: 130px;
  background-color: springgreen;
  border-radius: 50%;
  border-left: 10px solid mediumseagreen;
  border-right: 20px solid mediumseagreen;
  box-shadow: 0 0 20px 10px blue;
  ${commonCss}
`;

const HeartRight = styled(animated.div)`
  width: 100px;
  height: 130px;
  background-color: orange;
  border-radius: 50%;
  border-right: 20px solid firebrick;
  border-left: 10px solid firebrick;
  border-bottom: 20px solid firebrick;
  box-shadow: 0 0 20px 10px yellowgreen;
  ${commonCss}
`;

const HeartTop = styled(animated.div)`
  width: 140px;
  height: 140px;
  background-color: red;
  border-radius: 50%;
  border: 30px solid firebrick;
  z-index: -1;
  box-shadow: 0 0 20px 10px violet;
  ${commonCss};
`;

const Flex = styled.div`
  display: flex;
`;

export default {
  // commonCss,
  HeartBottom,
  HeartLeft,
  HeartTop,
  HeartRight,
  Flex,
}