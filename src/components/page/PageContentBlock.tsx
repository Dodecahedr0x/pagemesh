import { ContentBlock } from "../../utils/types";
import React from "react";

interface Props {
  block: ContentBlock;
}
export function PageContentBlock({ block }: Props) {
  switch (block) {
    default:
      return <div>{block.content.toString()}</div>;
  }
}
