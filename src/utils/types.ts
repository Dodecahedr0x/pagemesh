import { GraphQLProfileMetadata, ProfileMetadataType } from "@gumhq/sdk/lib/profileMetadata";

interface ProfileAccountData {
  userPublicKey: string,
  profileNamespace: string,
  profilePublicKey: string,
}
export type Profile = GraphQLProfileMetadata & ProfileMetadataType & ProfileAccountData & {[key:string]: any}