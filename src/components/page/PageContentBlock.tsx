import { ContentBlock } from "../../utils/types";
import { ContentBlockType } from "../../utils/constants";
import { PageContent } from "./PageContent";
import React from "react";
import { Tweet } from "./viewers/Tweet";

interface Props {
  block: ContentBlock;
}
export function PageContentBlock({ block }: Props) {
  let element = null;
  switch (block.contentType) {
    case ContentBlockType.Microblog:
      if (block.content.includes("https://twitter.com"))
        element = <Tweet url={block.content} />;
      else element = <Tweet url={block.content} />;
      break;
    case ContentBlockType.PersonalPage:
      element = <PageContent pageKey={block.content} />;
      break;
    default:
      element = <div>{block.content.toString()}</div>;
      break;
  }

  return <div className={`${block.className}`}>{element}</div>;
}
