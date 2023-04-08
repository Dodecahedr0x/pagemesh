import {
  GraphQLProfileMetadata,
  ProfileMetadataType,
} from "@gumhq/sdk/lib/profileMetadata";

import { Blocks } from "@gumhq/sdk/lib/postMetadata";
import { GraphQLPost } from "@gumhq/sdk/lib/post";
import { PostMetadata } from "@gumhq/sdk";
import { PublicKey } from "@solana/web3.js";

interface ProfileAccountData {
  userPublicKey: string;
  profileNamespace: string;
  profilePublicKey: string;
}
export type Profile = GraphQLProfileMetadata &
  ProfileMetadataType &
  ProfileAccountData & { [key: string]: any };

export interface ContentBlock {
  contentType: string;
  content: any;
  className: string;
}

interface PageAccount {
  postPublicKey: PublicKey;
  profilePublicKey: PublicKey;
  metadataUri: string;
  content: Blocks;
}

export type Page = PageAccount &
  Omit<PostMetadata, "validate"> & { author?: Profile } & {
    [key: string]: any;
  };
