import * as TG from "type-graphql";

@TG.ObjectType()
export default class Api {
  @TG.Field()
  public protocol: string;

  @TG.Field()
  public host: string;

  @TG.Field()
  public key: string;

  @TG.Field()
  public secret: string;
}
