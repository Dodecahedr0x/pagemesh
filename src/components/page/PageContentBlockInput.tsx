import { ContentBlock } from "../../utils/types";
import { ContentBlockType } from "../../utils/constants";
import { PageContent } from "./PageContent";
import React from "react";
import { Tweet } from "./viewers/Tweet";
import { TweetInput } from "./inputs/TweetInput";

interface Props {
  type: ContentBlockType;
  choice: (block: ContentBlock) => void;
  onClose: () => void;
}
export function PageContentBlockInput({ type, choice, onClose }: Props) {
  let element = null;
  switch (type) {
    case ContentBlockType.Microblog:
      element = <TweetInput choice={choice} onClose={onClose} />;
      break;
    default:
      element = <div>{type.toString()}</div>;
      break;
  }

  return element;
}
