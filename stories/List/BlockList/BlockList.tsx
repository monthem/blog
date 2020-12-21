import chroma from 'chroma-js'
import React from 'react'
import { CSSProperties } from 'styled-components'
import ShadowHoverResponder from '../../Responder/HoverResponder/ShadowHoverResponder'

type BlockListEntryProps = {
  text?: string;
  style?: CSSProperties;
  shadowColor?: CSSProperties["backgroundColor"];
  shadowOutlineColor?: CSSProperties["backgroundColor"];
}

const BlockListEntry: React.FC<BlockListEntryProps> = (props) => {
  const {
    text,
    style,
    shadowColor,
    shadowOutlineColor,
  } = props;
  const baseColor = style?.backgroundColor || chroma.random().hex();
  const chromaColor = chroma(baseColor);
  return (
    <ShadowHoverResponder
      shadowColor={shadowColor || chromaColor.darken().hex()}
      outlineColor={shadowOutlineColor || "black"}>
      <div style={{
        backgroundColor: baseColor,
        border: "1px solid black",
        ...style
      }}>
        {text}
      </div>
    </ShadowHoverResponder>
  )
}

export type BlockListProps<T> = {
  items: T[];
  render: (item: T, Entry: typeof BlockListEntry, index: number) => JSX.Element;
}

const BlockList: <T>(props: BlockListProps<T>) => JSX.Element = (props) => {
  const {
    items,
    render,
  } = props;
  return (
    <>
      {items.map((item, i) => render(item, BlockListEntry, i))}
    </>
  )
}

export default BlockList
