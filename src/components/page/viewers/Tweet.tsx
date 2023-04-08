import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

interface Props {
  url: string;
}
export function Tweet({ url }: Props) {
  const tweetId = url.split("/").pop();

  return <TwitterTweetEmbed tweetId={tweetId} />;
}
