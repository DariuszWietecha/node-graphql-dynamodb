
import * as AWS from "aws-sdk";
import * as TG from "type-graphql";
import { v1 as uuidv1 } from "uuid";
import ApiInput from "../schemas/ApiInput";
import Configuration from "../schemas/Configuration";

export interface IApi {
    protocol: string;
    host: string;
    key: string;
    secret: string;
}

export interface IConfiguration extends AWS.DynamoDB.DocumentClient.AttributeMap {
    api: IApi;
    id: string;
    name: string;
    userId: string;
}

async function getConfigurations(
    dynamoDBDocumentClient: AWS.DynamoDB.DocumentClient, userId: string): Promise<IConfiguration[] | undefined> {
    return new Promise((
        resolve: (configurations: IConfiguration[] | undefined) => void, reject) => {
        const params = {
            ExpressionAttributeValues: {
                ":userId": userId,
            },
            IndexName: "userId-index",
            KeyConditionExpression: "userId = :userId",
            TableName: "configuration",
        };

        dynamoDBDocumentClient.query(params, (error, data) => {
            if (error) {
                reject(error);
            }

            resolve(data.Items as IConfiguration[] | undefined);
        });
    });
}

async function saveConfigurations(
    dynamoDBDocumentClient: AWS.DynamoDB.DocumentClient, api: IApi, name: string, userId: string)
    : Promise<IConfiguration> {
    return new Promise((
        resolve: (configurations: IConfiguration) => void, reject) => {
        const params = {
            Item: {
                api,
                id: uuidv1(),
                name,
                userId,
            },
            TableName: "configuration",
        };

        dynamoDBDocumentClient.put(params, (error, data) => {
            if (error) {
                reject(error);
            }

            resolve(data.Attributes as IConfiguration);
        });
    });
}

@TG.Resolver(() => Configuration)
export default class {
    private dynamoDBDocumentClient: AWS.DynamoDB.DocumentClient;
    constructor() {
        if (typeof process.env.DYNAMODB_URL === undefined ||
            typeof process.env.AWS_ACCESS_KEY_ID === undefined ||
            typeof process.env.AWS_REGION === undefined ||
            typeof process.env.AWS_SECRET_ACCESS_KEY === undefined) {
            throw new Error(
                "DYNAMODB_URL, AWS_ACCESS_KEY_ID, AWS_REGION or AWS_SECRET_ACCESS_KEY not available in .env");
        }

        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            region: process.env.AWS_REGION,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        this.dynamoDBDocumentClient = new AWS.DynamoDB.DocumentClient({ endpoint: process.env.DYNAMODB_URL });
    }

    @TG.Mutation(() => Configuration)
    public saveConfigurations(
        @TG.Arg("api") api: ApiInput, @TG.Arg("name") name: string, @TG.Arg("userId") userId: string,
    ): Promise<IConfiguration> {
        return saveConfigurations(this.dynamoDBDocumentClient, api, name, userId);
    }

    @TG.Query(() => [Configuration])
    public async configurations(@TG.Arg("userId") userId: string): Promise<IConfiguration[] | undefined> {
        return getConfigurations(this.dynamoDBDocumentClient, userId);
    }
}
