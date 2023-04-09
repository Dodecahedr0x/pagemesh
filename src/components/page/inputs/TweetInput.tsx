import React, { useState } from "react";

import { ContentBlock } from "../../../utils/types";

interface Props {
  defaultUrl?: string;
  defaultStyle?: string;
  choice: (block: ContentBlock) => void;
  onClose: () => void;
}
export function TweetInput({
  defaultUrl,
  defaultStyle,
  choice,
  onClose,
}: Props) {
  const [url, setUrl] = useState<string>(defaultUrl);
  const [style, setStyle] = useState<string>(defaultStyle);

  return (
    <>
      <div className="form-control">
        <div>
          <label className="label">
            <span className="label-text">Enter Tweet URL</span>
          </label>
          <input
            className="input"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://twitter.com/0xMert_/status/1645003022987329542"
            defaultValue={defaultUrl}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Enter Tailwind classes</span>
          </label>
          <input
            className="input"
            onChange={(e) => setStyle(e.target.value)}
            placeholder="w-100"
            defaultValue={defaultStyle}
          />
        </div>
      </div>
      <div className="btn-group w-100">
        <div className="btn btn-secondary" onClick={onClose}>
          Cancel
        </div>
        <div
          className="btn btn-primary"
          onClick={() => {
            choice({
              contentType: "microblog",
              content: url,
              className: style,
            });
            onClose();
          }}
        >
          Create
        </div>
      </div>
    </>
  );
}
