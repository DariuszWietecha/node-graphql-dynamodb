import * as TG from "type-graphql";
import Api from "../schemas/Api";

@TG.InputType()
export default class ApiInput implements Partial<Api> {
  @TG.Field()
  public protocol: string;

  @TG.Field()
  public host: string;

  @TG.Field()
  public key: string;

  @TG.Field()
  public secret: string;
}
