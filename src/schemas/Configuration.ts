import * as TG from "type-graphql";
import Api from "./Api";

@TG.ObjectType()
export default class Configuration {
  @TG.Field()
  public id: string;

  @TG.Field()
  public name: string;

  @TG.Field()
  public userId: string;

  @TG.Field(() => Api)
  public api: Api;
}
