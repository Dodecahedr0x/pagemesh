import { GraphQLProfileMetadata, ProfileMetadataType } from "@gumhq/sdk/lib/profileMetadata";

export type Profile = GraphQLProfileMetadata & ProfileMetadataType & {[key:string]: any}