import React, { useState } from "react";

import { ContentBlock } from "../../../utils/types";

interface Props {
  choice: (block: ContentBlock) => void;
  onClose: () => void;
}
export function TweetInput({ choice, onClose }: Props) {
  const [url, setUrl] = useState<string>("");

  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Enter amount</span>
        </label>
        <input
          className="input"
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://twitter.com/0xMert_/status/1645003022987329542"
        />
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
              className: "",
            });
            onClose;
          }}
        >
          Create
        </div>
      </div>
    </>
  );
}
